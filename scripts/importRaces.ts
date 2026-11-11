import 'dotenv/config';
import mongoose from 'mongoose';
import { getConnectionString } from '../lib/db';
import { fetchTopicHtml } from '../services/forumSheet.service';
import { importRaceTopic } from '../services/race.service';

/**
 * Importa todas as raças do fórum de uma vez.
 *
 * Lê a listagem de /f27-racas e importa cada tópico dela. O subfórum de raças
 * monstro fica de fora de propósito: só os tópicos listados direto em f27
 * entram — os links de subfórum são /fNN, não /tNN, e não casam abaixo.
 *
 * Sem `--apply` só relata o que seria gravado.
 *
 *   npx tsx ./scripts/importRaces.ts
 *   npx tsx ./scripts/importRaces.ts --apply
 */

const FORUM_ORIGIN = 'https://isekaifantasy.forumbrasil.net';
const RACES_FORUM = `${FORUM_ORIGIN}/f27-racas`;

/**
 * Os tópicos da listagem. Só o link do título (`topictitle`) conta: a página
 * também linka a última mensagem de cada tópico e os tópicos recentes de
 * outros fóruns na barra lateral, e esses não são raças.
 */
function topicUrls(html: string): string[] {
  const links = [
    ...html.matchAll(/class="topictitle\d*"[^>]*href="(\/t\d+-[^"#?]+)"/g),
  ].map((m) => `${FORUM_ORIGIN}${m[1]}`);
  return [...new Set(links)];
}

async function main() {
  const apply = process.argv.includes('--apply');
  const uri = getConnectionString();
  if (!uri) throw new Error('Conexão com o banco não configurada no .env.');
  await mongoose.connect(uri);

  const urls = topicUrls(await fetchTopicHtml(RACES_FORUM));
  if (urls.length === 0) {
    throw new Error('Nenhum tópico encontrado na listagem de raças.');
  }
  console.log(`${urls.length} tópicos em ${RACES_FORUM}\n`);

  let failed = 0;
  for (const url of urls) {
    try {
      const result = await importRaceTopic(url, { dryRun: !apply });
      const verb = result.created ? 'nova' : 'atualiza';
      console.log(
        `✓ ${result.name} (${verb}) — ${result.subraces} sub-raças, ${result.traits} habilidades`
      );
      for (const warning of result.warnings) console.log(`    ⚠ ${warning}`);
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`✗ ${url} — ${message}`);
    }
  }

  if (failed) console.log(`\n${failed} tópico(s) falharam.`);
  if (!apply) console.log('\nNada gravado. Rode com --apply para gravar.');
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
