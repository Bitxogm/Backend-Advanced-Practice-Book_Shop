/**
 * Script para generar datos de prueba en la base de datos
 * Crea usuarios y libros con diferentes estados
 *
 * Uso: npm run seed
 */

import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../src/config/environment';
import { BookModelMongoose } from '../src/infrastructure/models/book.model';
import UserModel from '../src/infrastructure/models/user-model';

// Datos para ser usados en la generación de libros
const bookTitles = [
  'El Quijote',
  'Cien años de soledad',
  'Don Juan',
  'La metamorfosis',
  'El proceso',
  'En busca del tiempo perdido',
  'La montaña mágica',
  'Moby Dick',
  'Jane Eyre',
  'Orgullo y prejuicio',
  'Crimen y castigo',
  'El idiota',
  'Guerra y paz',
  'Anna Karenina',
  'Madame Bovary',
  'El padre Goriot',
  'Los miserables',
  'El conde de Montecristo',
  'Ivanhoé',
  'Frankestein',
  '1984',
  'Un mundo feliz',
  'Farenheit 451',
  'El aprendiz',
  'La revolución de los topos',
  'Harry Potter 1',
  'Harry Potter 2',
  'Harry Potter 3',
  'Harry Potter 4',
  'Harry Potter 5',
  'El señor de los anillos',
  'El hobbit',
  'La brújula dorada',
  'El asesinato de Roger Ackroyd',
  'Desayuno con diamantes',
  'El código Da Vinci',
  'Aves de presa',
  'La chica del tren',
  'Antes de partir',
  'El tiempo entre costuras',
  'La casa de los espíritus',
  'La sombra del viento',
  'Los juegos del hambre',
  'Divergente',
  'El corredor del laberinto',
  'Saga Crepúsculo',
  'Percy Jackson',
  'Trails',
  'La bella y la bestia',
  'Alicia en el país de las maravillas',
  'El principito',
  'Winnie the Pooh',
  'Las aventuras de Tom Sawyer',
  'Las aventuras de Huckleberry Finn',
];

const authors = [
  'Miguel de Cervantes',
  'Gabriel García Márquez',
  'Lord Byron',
  'Franz Kafka',
  'J.D. Salinger',
  'Marcel Proust',
  'Thomas Mann',
  'Herman Melville',
  'Charlotte Brontë',
  'Jane Austen',
  'Fiódor Dostoievski',
  'León Tolstói',
  'Gustave Flaubert',
  'Honoré de Balzac',
  'Victor Hugo',
  'Alexandre Dumas',
  'Walter Scott',
  'Mary Shelley',
  'George Orwell',
  'Aldous Huxley',
  'Ray Bradbury',
  'Stephenie Meyer',
  'Suzanne Collins',
  'Veronica Roth',
  'James Dashner',
  'J.K. Rowling',
  'J.R.R. Tolkien',
  'Philip Pullman',
  'Agatha Christie',
  'Truman Capote',
  'Dan Brown',
  'Paula Hawkins',
  'Colleen Hoover',
  'Martha Medina',
  'Carlos Ruiz Zafón',
  'Isabel Allende',
  'Miguel de Unamuno',
  'Arturo Pérez-Reverte',
  'Isaac Asimov',
  'Arthur C. Clarke',
  'Philip K. Dick',
  'Ursula K. Le Guin',
  'Stephen King',
];

const descriptions = [
  'Una novela clásica que ha fascinado a millones de lectores alrededor del mundo.',
  'Una obra maestra de la literatura que explora temas profundos sobre la existencia.',
  'Un libro imprescindible que todo lector debe tener en su biblioteca.',
  'Una historia cautivadora que te mantendrá pegado hasta el final.',
  'Un bestseller internacional que ha recibido múltiples premios literarios.',
  'Una novela que desafía los límites de la imaginación y la razón.',
  'Un clásico de la literatura contemporánea que sigue siendo relevante hoy.',
  'Una obra que revolucionó el mundo de la literatura.',
  'Un libro que te hará pensar diferente sobre la vida.',
  'Una novela que combina misterio, aventura y emoción.',
];

// Géneros disponibles
const genres = [
  'Ficción',
  'Fantasía',
  'Ciencia Ficción',
  'Misterio',
  'Romance',
  'Terror',
  'Aventura',
  'Drama',
  'Humor',
  'Histórico',
];

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔍 Conectando a MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

const generateRandomEmail = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user${randomString}@example.com`;
};

const generateUsers = async (count: number = 15): Promise<string[]> => {
  console.log(`\n📝 Creando ${count} usuarios...`);
  const userIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const email = generateRandomEmail();
    const hashedPassword = await bcryptjs.hash('password123', 10);

    try {
      const user = await UserModel.create({
        email,
        password: hashedPassword,
      });
      userIds.push(user._id.toString());
      console.log(`  ✓ Usuario ${i + 1}/${count}: ${email}`);
    } catch (error: any) {
      if (error.code !== 11000) {
        // 11000 es error de duplicate key
        console.error(`  ✗ Error creando usuario: ${error.message}`);
      }
    }
  }

  return userIds;
};

const generateBooks = async (userIds: string[], count: number = 200): Promise<void> => {
  console.log(`\n📚 Generando ${count} libros...`);

  const books = [];
  const publishedCount = Math.floor(count * 0.7); // 70% publicados
  const soldCount = count - publishedCount; // 30% vendidos

  // Libros publicados
  for (let i = 0; i < publishedCount; i++) {
    const randomOwner = userIds[Math.floor(Math.random() * userIds.length)];
    const randomTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomPrice = (Math.random() * 50 + 5).toFixed(2); // Precio entre 5 y 55

    books.push({
      title: `${randomTitle} - Copia ${i + 1}`,
      description: randomDescription,
      price: parseFloat(randomPrice),
      author: randomAuthor,
      status: 'PUBLISHED',
      ownerId: new mongoose.Types.ObjectId(randomOwner),
      soldAt: null,
    });
  }

  // Libros vendidos
  for (let i = 0; i < soldCount; i++) {
    const randomOwner = userIds[Math.floor(Math.random() * userIds.length)];
    const randomTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomPrice = (Math.random() * 50 + 5).toFixed(2);

    // Fecha de venta aleatoria en los últimos 30 días
    const daysAgo = Math.floor(Math.random() * 30);
    const soldDate = new Date();
    soldDate.setDate(soldDate.getDate() - daysAgo);

    books.push({
      title: `${randomTitle} - Copia ${publishedCount + i + 1}`,
      description: randomDescription,
      price: parseFloat(randomPrice),
      author: randomAuthor,
      status: 'SOLD',
      ownerId: new mongoose.Types.ObjectId(randomOwner),
      soldAt: soldDate,
    });
  }

  try {
    await BookModelMongoose.insertMany(books, { ordered: false });
    console.log(`  ✅ ${count} libros creados exitosamente`);
    console.log(`     - Publicados: ${publishedCount}`);
    console.log(`     - Vendidos: ${soldCount}`);
  } catch (error: any) {
    if (error.insertedDocs) {
      console.log(`  ✅ ${error.insertedDocs.length} libros creados`);
      console.log(`  ⚠️  Algunos libros no se pudieron crear (posibles duplicados)`);
    } else {
      console.error(`  ✗ Error creando libros: ${error.message}`);
    }
  }
};

const clearDatabase = async (): Promise<void> => {
  console.log('\n🗑️  Limpiando colecciones previas...');
  try {
    await BookModelMongoose.deleteMany({});
    await UserModel.deleteMany({});
    console.log('  ✅ Base de datos limpiada');
  } catch (error) {
    console.error('  ✗ Error limpiando la base de datos:', error);
  }
};

const printSummary = async (userCount: number, bookCount: number): Promise<void> => {
  const actualUsers = await UserModel.countDocuments();
  const actualBooks = await BookModelMongoose.countDocuments();
  const publishedBooks = await BookModelMongoose.countDocuments({ status: 'PUBLISHED' });
  const soldBooks = await BookModelMongoose.countDocuments({ status: 'SOLD' });

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE LA OPERACIÓN');
  console.log('='.repeat(50));
  console.log(`  Usuarios creados: ${actualUsers}`);
  console.log(`  Total de libros: ${actualBooks}`);
  console.log(`    - Publicados: ${publishedBooks}`);
  console.log(`    - Vendidos: ${soldBooks}`);
  console.log('='.repeat(50) + '\n');
};

const main = async (): Promise<void> => {
  try {
    await connectDB();
    await clearDatabase();

    const userIds = await generateUsers(15);
    await generateBooks(userIds, 200);

    await printSummary(15, 200);

    console.log('✨ ¡Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

main();
