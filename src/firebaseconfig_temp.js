// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDNB_FM-v33OOo46ntwFNeYDIyHW-CQfbU",
  authDomain: "chat-application-e174b.firebaseapp.com",
  projectId: "chat-application-e174b",
  storageBucket: "chat-application-e174b.firebasestorage.app",
  messagingSenderId: "967304951560",
  appId: "1:967304951560:web:8398a1dd2e23d2dd595ebd",
  measurementId: "G-Q3YEQYP51L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

export default app;
