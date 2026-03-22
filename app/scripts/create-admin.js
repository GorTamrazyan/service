const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I",
    authDomain: "mywebsiteauth-c45cd.firebaseapp.com",
    projectId: "mywebsiteauth-c45cd",
    storageBucket: "mywebsiteauth-c45cd.firebasestorage.app",
    messagingSenderId: "566415645776",
    appId: "1:566415645776:web:975d884b280b83bb32c555",
    measurementId: "G-4PKW9LNV2C",
};

const FIREBASE_API_KEY = "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME || 'admin';

    if (!email || !password) {
        console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
        process.exit(1);
    }

    try {
        // Check if admin with this email already exists in Firestore
        const existing = await getDocs(query(collection(db, 'admins'), where('email', '==', email)));
        if (!existing.empty) {
            console.error(`❌ Admin with email "${email}" already exists`);
            process.exit(1);
        }

        console.log('🔧 Creating Firebase Auth user...');

        // Create user in Firebase Auth via REST API
        const signUpRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        );

        const signUpData = await signUpRes.json();

        if (signUpData.error) {
            throw new Error(signUpData.error.message);
        }

        const { localId: uid, idToken } = signUpData;

        // Send email verification
        console.log('📧 Sending verification email...');
        await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken }),
            }
        );

        // Store admin data in Firestore (no password)
        console.log('💾 Saving admin data to Firestore...');
        await setDoc(doc(db, 'admins', uid), {
            email,
            username,
            role: 'super_admin',
            permissions: [
                'manage_admins',
                'manage_products',
                'manage_orders',
                'manage_users',
                'view_analytics',
                'manage_settings',
                'delete_data',
            ],
            createdAt: new Date(),
            isActive: true,
        });

        console.log('✅ Super admin created successfully!');
        console.log(`📧 Email: ${email}`);
        console.log(`👤 Username: ${username}`);
        console.log(`🆔 Firebase UID: ${uid}`);
        console.log('');
        console.log('📬 A verification email has been sent. Please verify before logging in.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message || error);
        process.exit(1);
    }
}

createAdmin();
