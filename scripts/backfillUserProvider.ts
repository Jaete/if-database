import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({
  path: [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ],
});

import { connectDB, disconnectDB } from '@/lib/db';
import User from '@/db/users/users';

const backfill = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await connectDB();

    const result = await User.updateMany(
      { provider: { $exists: false } },
      { $set: { provider: 'local' } }
    );

    console.log(
      `✅ ${result.modifiedCount} usuário(s) marcado(s) como 'local'.`
    );

    await disconnectDB();
    process.exit(0);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro no backfill:', message);
    process.exit(1);
  }
};

void backfill();
