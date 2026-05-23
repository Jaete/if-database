import { getConnectionString } from '@/lib/db';
import 'dotenv/config';
import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    const uri = getConnectionString();
    if (!uri) {
      console.error('❌ MONGODB_URI não encontrada no .env');
      return;
    }

    console.log(
      `🔍 Conectendo a: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`
    ); // Esconde senha no log

    await mongoose.connect(uri);

    const db = mongoose.connection.db;

    if (!db) {
      console.error('❌ Banco de dados não encontrado');
      return;
    }
    console.log(`✅ Conectado ao banco: ${db.databaseName}`);

    const collection = db.collection('monsters');
    const count = await collection.countDocuments();

    console.log(`📊 Total de documentos na coleção 'monsters': ${count}`);

    if (count > 0) {
      const first = await collection.findOne();

      if (!first) {
        console.error('❌ Primeiro documento não encontrado');
        return;
      }

      console.log('\n📄 Primeiro documento encontrado:');
      console.log(`   Nome: ${first.name}`);
      console.log(`   Slug: ${first.slug}`);
      console.log(`   ID: ${first._id}`);
    } else {
      console.log('⚠️ A coleção está vazia!');
    }

    await mongoose.disconnect();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro ao verificar:', errorMessage);
  }
}

checkDatabase();
