
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNB_FM-v33OOo46ntwFNeYDIyHW-CQfbU",
  authDomain: "chat-application-e174b.firebaseapp.com",
  projectId: "chat-application-e174b",
  storageBucket: "chat-application-e174b.firebasestorage.app",
  messagingSenderId: "967304951560",
  appId: "1:967304951560:web:8398a1dd2e23d2dd595ebd",
  measurementId: "G-Q3YEQYP51L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export default app;



































































