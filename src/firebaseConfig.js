// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTNylnxQT0pSQ6OxkBsG_q4sRAPkXxFoM",
  authDomain: "chatty-ba61d.firebaseapp.com",
  projectId: "chatty-ba61d",
  storageBucket: "chatty-ba61d.firebasestorage.app",
  messagingSenderId: "1002464337849",
  appId: "1:1002464337849:web:a51e4ceca0886571e5a068",
  measurementId: "G-RBN91166SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

export default app;
