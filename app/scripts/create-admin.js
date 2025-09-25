// scripts/create-admin.js (БЕЗ Firebase Auth)
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I",
    authDomain: "mywebsiteauth-c45cd.firebaseapp.com",
    projectId: "mywebsiteauth-c45cd",
    storageBucket: "mywebsiteauth-c45cd.firebasestorage.app",
    messagingSenderId: "566415645776",
    appId: "1:566415645776:web:975d884b280b83bb32c555",
    measurementId: "G-4PKW9LNV2C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdmin() {
    try {
        console.log('🔧 Creating admin user in Firestore...');

        const email = "gor.tamrazyan5@mail.ru";
        const password = "123321";

        // Создаем админа только в Firestore (БЕЗ Firebase Auth)
        const adminData = {
            email,
            password, // В продакшене используйте bcrypt!
            username: "admin",
            role: "super_admin",
            permissions: [
                'manage_admins',
                'manage_products',
                'manage_orders',
                'manage_users',
                'view_analytics',
                'manage_settings',
                'delete_data'
            ],
            createdAt: new Date(),
            isActive: true
        };

        const adminDocRef = await addDoc(collection(db, "admins"), adminData);

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email: gor.tamrazyan5@mail.ru");
        console.log("🔑 Password: 123321");
        console.log("🆔 Doc ID:", adminDocRef.id);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    }
}

createAdmin();