import sharp, { type OutputInfo } from 'sharp';
import CharacterClassModel from '../db/classes/classes';
import CitizenModel from '../db/citizens/citizens';
import ImageModel from '../db/images/images';
import MonsterModel from '../db/monsters/monsters';
import PlayerModel from '../db/players/players';
import RaceModel from '../db/races/races';
import SpellModel from '../db/spells/spells';
import { IMAGE_ID, uploadedImageId } from '../lib/imageUrl';

export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_SIDE = 1600;
const WEBP_QUALITY = 80;
// ~25 megapixels: acima disso a decodificação gasta memória demais no Render.
const MAX_INPUT_PIXELS = 25_000_000;

// Uma decodificação por vez: a instância gratuita do Render tem pouca memória.
sharp.concurrency(1);

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

/**
 * Valida decodificando de verdade (o cabeçalho de mime não prova nada), reduz
 * para caber em 1600px, converte para WebP e grava na coleção `images`.
 */
export async function createImage(input: Buffer, uploadedBy: string) {
  if (input.length === 0) {
    throw new ImageUploadError('O arquivo está vazio.', 400);
  }
  if (input.length > MAX_INPUT_BYTES) {
    throw new ImageUploadError('A imagem passa de 10 MB.', 413);
  }

  let output: Buffer;
  let info: OutputInfo;
  try {
    const source = sharp(input, {
      limitInputPixels: MAX_INPUT_PIXELS,
      failOn: 'error',
    });
    const meta = await source.metadata();
    if ((meta.pages ?? 1) > 1) {
      throw new ImageUploadError('Imagens animadas não são aceitas.', 415);
    }
    ({ data: output, info } = await source
      .rotate()
      .resize({
        width: MAX_SIDE,
        height: MAX_SIDE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true }));
  } catch (error) {
    if (error instanceof ImageUploadError) throw error;
    const message = error instanceof Error ? error.message : '';
    if (/pixel limit/i.test(message)) {
      throw new ImageUploadError('A imagem tem pixels demais.', 413);
    }
    throw new ImageUploadError('O arquivo não é uma imagem válida.', 415);
  }

  const doc = await ImageModel.create({
    data: output,
    contentType: 'image/webp',
    width: info.width,
    height: info.height,
    bytes: output.length,
    uploadedBy,
  });

  return {
    id: String(doc._id),
    width: info.width,
    height: info.height,
    bytes: output.length,
  };
}

/** Os bytes de uma imagem, ou null para id inválido/inexistente. */
export async function getImageData(id: string) {
  if (!IMAGE_ID.test(id)) return null;
  const doc = await ImageModel.findById(id)
    .select('+data contentType')
    .lean<{ data: { buffer: Uint8Array } | Uint8Array; contentType: string }>();
  if (!doc) return null;
  // `lean` devolve o Binary do driver, não um Buffer.
  const raw = doc.data instanceof Uint8Array ? doc.data : doc.data.buffer;
  return { data: Buffer.from(raw), contentType: doc.contentType };
}

/** Os ids de imagens enviadas entre as URLs dadas (links externos ficam de fora). */
export function uploadedImageIds(urls: (string | undefined | null)[]) {
  return new Set(
    urls.map(uploadedImageId).filter((id): id is string => id !== null)
  );
}

/**
 * Apaga as imagens enviadas que nenhum documento mais usa. Chamada DEPOIS de
 * gravar a troca/remoção, nunca no envio: o editor pode ser cancelado e o campo
 * ainda apontaria para o arquivo antigo. Só ids `/api/images/<id>` chegam aqui;
 * falha é registrada e não derruba quem salvou.
 */
export async function deleteUnreferencedImages(ids: Iterable<string>) {
  try {
    const candidates = [...new Set(ids)];
    if (candidates.length === 0) return;
    const urls = candidates.map((id) => `/api/images/${id}`);

    // As classes guardam `image` em níveis fundos (relações, ordens divinas):
    // uma varredura única do JSON serve a todos os candidatos.
    const classes = JSON.stringify(
      await CharacterClassModel.find().lean<object[]>()
    );

    for (const [index, id] of candidates.entries()) {
      const url = urls[index];
      if (classes.includes(url)) continue;
      const used = await Promise.all([
        RaceModel.exists({
          $or: [{ 'images.url': url }, { 'subraces.image.url': url }],
        }),
        SpellModel.exists({ image: url }),
        MonsterModel.exists({ $or: [{ image: url }, { icon: url }] }),
        CitizenModel.exists({ $or: [{ image: url }, { icon: url }] }),
        PlayerModel.exists({ $or: [{ image: url }, { icon: url }] }),
      ]);
      if (used.some(Boolean)) continue;
      await ImageModel.deleteOne({ _id: id });
    }
  } catch (error) {
    console.error('Falha ao apagar imagens órfãs', error);
  }
}
