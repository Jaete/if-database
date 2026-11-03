import 'dotenv/config';
import mongoose from 'mongoose';
import { getConnectionString } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import type {
  ICharacterClass,
  IClassCatalog,
  IRelationEntity,
} from '../db/classes/class.d';

async function main() {
  const uri = getConnectionString();
  if (!uri) throw new Error('No connection string');
  await mongoose.connect(uri);

  const doc = (await CharacterClassModel.findOne({
    slug: 'clerigo',
  }).lean()) as ICharacterClass | null;
  const cat = doc?.catalogs?.find((c: IClassCatalog) => c.kind === 'relacao');

  if (!cat) {
    console.log('NO RELACAO CATALOG');
    await mongoose.disconnect();
    return;
  }

  // Check entities have the right shape
  const a0 = cat.groupA?.entities?.[0];
  if (a0) {
    console.log('Order entity keys:', Object.keys(a0));
    console.log(
      'relatedSlugs type:',
      typeof a0.relatedSlugs,
      Array.isArray(a0.relatedSlugs)
    );
    console.log('relatedSlugs:', a0.relatedSlugs);
    console.log('facts:', JSON.stringify(a0.facts));
    console.log('abilities count:', a0.abilities?.length);
  }

  const b0 = cat.groupB?.entities?.[0];
  if (b0) {
    console.log('\nDomain entity keys:', Object.keys(b0));
    console.log('relatedSlugs:', b0.relatedSlugs);
    console.log('abilities:', b0.abilities?.length);
    console.log('list:', JSON.stringify(b0.list));
  }

  // Check for any entity missing relatedSlugs (could crash)
  const missingA = (cat.groupA?.entities ?? []).filter(
    (e: IRelationEntity) => !e.relatedSlugs
  );
  const missingB = (cat.groupB?.entities ?? []).filter(
    (e: IRelationEntity) => !e.relatedSlugs
  );
  console.log('\nMissing relatedSlugs in A:', missingA.length);
  console.log('Missing relatedSlugs in B:', missingB.length);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
