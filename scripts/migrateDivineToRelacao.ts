import 'dotenv/config';
import mongoose from 'mongoose';
import { getConnectionString } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import type {
  ICharacterClass,
  IClassCatalog,
  IDivineOrder,
  IClassDomain,
  IRelationEntity,
  IRelationGroup,
} from '../db/classes/class.d';

/**
 * Migra `divineOrders` + `domains` do Clérigo para um catálogo `relacao`.
 *
 * Ordens viram groupA, domínios viram groupB. Os campos `spellcasting`,
 * `skill` e `weapon` viram facts; `abilities` mapeia direto; `domainSlugs`
 * vira `relatedSlugs`. Powers de domínio viram abilities; spells viram a
 * linked list.
 *
 * Idempotente: pula classes que já têm um catálogo relacao com o mesmo slug.
 * Sem `--apply` só relata o que faria.
 *
 *   npx tsx ./scripts/migrateDivineToRelacao.ts
 *   npx tsx ./scripts/migrateDivineToRelacao.ts --apply
 */

function orderToEntity(order: IDivineOrder): IRelationEntity {
  const facts = [
    { label: 'Magias', value: order.spellcasting },
    { label: 'Perícia', value: order.skill },
    { label: 'Arma Favorita', value: order.weapon },
  ].filter((f) => f.value);

  return {
    name: order.name,
    slug: order.slug,
    subtitle: order.deity ? `Devotos de ${order.deity}` : undefined,
    image: order.image,
    description: order.description,
    facts,
    abilities: (order.abilities ?? []).map((a) => ({
      name: a.name,
      level: a.level,
      description: a.description,
      tables: a.tables,
    })),
    relatedSlugs: order.domainSlugs ?? [],
  };
}

function domainToEntity(domain: IClassDomain): IRelationEntity {
  return {
    name: domain.name,
    slug: domain.slug,
    description: domain.description,
    abilities: (domain.powers ?? []).map((p) => ({
      name: p.name,
      level: p.level,
      description: p.description,
    })),
    list:
      domain.spells?.length > 0
        ? {
            label: 'Magias do Domínio',
            items: domain.spells.map((s) => ({
              rank: s.circle,
              name: s.name,
            })),
          }
        : undefined,
    relatedSlugs: [],
  };
}

async function main() {
  const apply = process.argv.includes('--apply');
  const uri = getConnectionString();
  if (!uri) throw new Error('Conexão com o banco não configurada no .env.');
  await mongoose.connect(uri);

  const classes = await CharacterClassModel.find({
    $or: [
      { 'divineOrders.0': { $exists: true } },
      { 'domains.0': { $exists: true } },
    ],
  }).lean();

  const operations: mongoose.AnyBulkWriteOperation<ICharacterClass>[] = [];

  for (const cls of classes) {
    const orders = (cls.divineOrders ?? []) as IDivineOrder[];
    const domains = (cls.domains ?? []) as IClassDomain[];

    if (orders.length === 0 && domains.length === 0) continue;

    const catalogSlug = 'ordens-e-dominios';
    const existing = (cls.catalogs ?? []) as IClassCatalog[];
    if (existing.some((c) => c.slug === catalogSlug && c.kind === 'relacao')) {
      console.log(`${cls.name}: já migrado, pulando.`);
      continue;
    }

    const groupA: IRelationGroup = {
      label: 'Ordens Deíficas',
      unitSingular: 'ordem',
      unitPlural: 'ordens',
      entities: orders.map(orderToEntity),
    };

    const groupB: IRelationGroup = {
      label: 'Domínios',
      unitSingular: 'domínio',
      unitPlural: 'domínios',
      entities: domains.map(domainToEntity),
    };

    const catalog: IClassCatalog = {
      name: 'Ordens & Domínios',
      slug: catalogSlug,
      kind: 'relacao',
      icon: 'halo-sword',
      description:
        'Cada ordem serve a uma deidade e libera um conjunto de domínios. ' +
        'O clérigo jura uma ordem e escolhe dois desses domínios.',
      items: [],
      groupA,
      groupB,
    };

    console.log(
      `${cls.name}: ${orders.length} ordens + ${domains.length} domínios → catálogo relação`
    );

    operations.push({
      updateOne: {
        filter: { _id: cls._id },
        update: {
          $push: { catalogs: catalog },
          $unset: { divineOrders: '', domains: '' },
        } as unknown as mongoose.UpdateQuery<ICharacterClass>,
      },
    });
  }

  if (operations.length === 0) {
    console.log('Nenhuma classe com divineOrders/domains para migrar.');
  } else if (apply) {
    await CharacterClassModel.bulkWrite(operations);
    console.log(`${operations.length} classe(s) migrada(s).`);
  } else {
    console.log(
      `${operations.length} classe(s) a migrar. Rode com --apply para gravar.`
    );
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
