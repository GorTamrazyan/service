// lib/firebase/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // <--- УДАЛИТЬ: Не импортируем здесь Analytics

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I",
    authDomain: "mywebsiteauth-c45cd.firebaseapp.com",
    projectId: "mywebsiteauth-c45cd",
    storageBucket: "mywebsiteauth-c45cd.firebasestorage.app",
    messagingSenderId: "566415645776",
    appId: "1:566415645776:web:975d884b280b83bb32c555",
    measurementId: "G-4PKW9LNV2C", // Можно оставить здесь, но не инициализировать
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// <--- УДАЛИТЬ: const analytics = getAnalytics(app);
// <--- УДАЛИТЬ: export { app, analytics };

export { app }; // Экспортируем только app, auth, db
