// scripts/client-migrate-to-firestore.js

const { PrismaClient } = require("../app/generated/prisma");
const { initializeApp, getApps } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  doc, 
  writeBatch,
  getDocs,
  Timestamp
} = require("firebase/firestore");

// Firebase конфигурация (из вашего firebase.ts файла)
const firebaseConfig = {
  apiKey: "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I",
  authDomain: "mywebsiteauth-c45cd.firebaseapp.com",
  projectId: "mywebsiteauth-c45cd",
  storageBucket: "mywebsiteauth-c45cd.firebasestorage.app",
  messagingSenderId: "566415645776",
  appId: "1:566415645776:web:975d884b280b83bb32c555",
  measurementId: "G-4PKW9LNV2C"
};

// Инициализируем Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const prisma = new PrismaClient();

// Преобразование Product объекта для Firestore
const productToFirestore = (product) => {
  return {
    name: product.name,
    description: product.description || null,
    price: product.price,
    imageUrl: product.imageUrl || null,
    category: product.category || null,
    inStock: product.inStock,
    createdAt: Timestamp.fromDate(product.createdAt),
    updatedAt: Timestamp.fromDate(product.updatedAt)
  };
};

async function migrateProducts() {
  console.log("Начинаем миграцию продуктов из Prisma в Firestore...");

  try {
    // Получаем все продукты из Prisma
    const products = await prisma.product.findMany();
    console.log(`Найдено ${products.length} продуктов в Prisma базе`);

    if (products.length === 0) {
      console.log("Нет продуктов для миграции");
      return;
    }

    // Создаем batch для пакетной записи
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');

    products.forEach((product) => {
      // Создаем новый документ в Firestore
      const docRef = doc(productsRef); // Firestore сгенерирует новый ID
      
      // Преобразуем данные для Firestore
      const firestoreData = productToFirestore(product);

      batch.set(docRef, firestoreData);
      console.log(`Подготовлен к миграции: ${product.name}`);
    });

    // Выполняем пакетную запись
    await batch.commit();
    console.log(`✅ Успешно мигрировано ${products.length} продуктов в Firestore!`);

    // Проверяем что данные действительно записались
    const firestoreProducts = await getDocs(productsRef);
    console.log(`🔍 Проверка: в Firestore теперь ${firestoreProducts.size} продуктов`);

  } catch (error) {
    console.error("❌ Ошибка при миграции:", error);
    throw error;
  }
}

async function clearFirestoreProducts() {
  console.log("🧹 Очищаем существующие продукты в Firestore...");
  
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  if (snapshot.empty) {
    console.log("Коллекция products пуста");
    return;
  }

  const batch = writeBatch(db);
  snapshot.docs.forEach(docSnapshot => {
    batch.delete(docSnapshot.ref);
  });

  await batch.commit();
  console.log(`🗑️ Удалено ${snapshot.size} продуктов из Firestore`);
}

async function main() {
  try {
    // Проверяем аргументы командной строки
    const args = process.argv.slice(2);
    if (args.includes('--clear')) {
      await clearFirestoreProducts();
    }
    
    await migrateProducts();
    console.log("🎉 Миграция завершена успешно!");
  } catch (error) {
    console.error("💥 Миграция завершилась с ошибкой:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Соединение с Prisma закрыто");
  }
}

main();