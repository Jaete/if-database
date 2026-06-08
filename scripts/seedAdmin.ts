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

import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import { hashPassword } from '@/services/auth.service';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const seedAdmin = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await connectDB();

    console.log(`\n👤 Criando usuário admin: "${ADMIN_USERNAME}"...`);

    const hashedPassword = hashPassword(ADMIN_PASSWORD);

    await User.deleteOne({ username: ADMIN_USERNAME });

    await User.create({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`✅ Usuário admin "${ADMIN_USERNAME}" criado com sucesso!`);

    const { disconnectDB } = await import('@/lib/db');
    await disconnectDB();
    process.exit(0);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro no seed:', errorMessage);
    process.exit(1);
  }
};

void seedAdmin();
