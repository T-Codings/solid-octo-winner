// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{ getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYhecfMd5XgIKnhCMCdM6DUJpgCQ7WPSE",
  authDomain: "first-project-a211e.firebaseapp.com",
  projectId: "first-project-a211e",
  storageBucket: "first-project-a211e.firebasestorage.app",
  messagingSenderId: "315203969457",
  appId: "1:315203969457:web:769ee616f122abf2bb9d90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;