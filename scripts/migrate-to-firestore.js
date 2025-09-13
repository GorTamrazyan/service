// scripts/migrate-to-firestore.js

const { PrismaClient } = require("../app/generated/prisma");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Инициализируем Firebase Admin (для серверных операций)
if (!getApps().length) {
  // Используем конфигурацию из клиентского Firebase
  initializeApp({
    projectId: "mywebsiteauth-c45cd"
  });
}

const db = getFirestore();
const prisma = new PrismaClient();

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
    const batch = db.batch();
    const productsRef = db.collection('products');

    products.forEach((product) => {
      // Создаем новый документ в Firestore
      const docRef = productsRef.doc(); // Firestore сгенерирует новый ID
      
      // Преобразуем данные для Firestore
      const firestoreData = {
        name: product.name,
        description: product.description || null,
        price: product.price,
        imageUrl: product.imageUrl || null,
        category: product.category || null,
        inStock: product.inStock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };

      batch.set(docRef, firestoreData);
      console.log(`Подготовлен к миграции: ${product.name}`);
    });

    // Выполняем пакетную запись
    await batch.commit();
    console.log(`✅ Успешно мигрировано ${products.length} продуктов в Firestore!`);

    // Проверяем что данные действительно записались
    const firestoreProducts = await productsRef.get();
    console.log(`🔍 Проверка: в Firestore теперь ${firestoreProducts.size} продуктов`);

  } catch (error) {
    console.error("❌ Ошибка при миграции:", error);
    throw error;
  }
}

async function main() {
  try {
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

// Добавим опцию для очистки Firestore коллекции перед миграцией
async function clearFirestoreProducts() {
  console.log("🧹 Очищаем существующие продукты в Firestore...");
  
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();
  
  if (snapshot.empty) {
    console.log("Коллекция products пуста");
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`🗑️ Удалено ${snapshot.size} продуктов из Firestore`);
}

// Проверяем аргументы командной строки
const args = process.argv.slice(2);
if (args.includes('--clear')) {
  clearFirestoreProducts().then(() => main());
} else {
  main();
}