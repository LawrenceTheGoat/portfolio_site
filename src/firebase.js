
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkpRsiz4gUEOygXYUQyE15eAWu5YN3aoA",
  authDomain: "portfolio-site-cac95.firebaseapp.com",
  projectId: "portfolio-site-cac95",
  storageBucket: "portfolio-site-cac95.firebasestorage.app",
  messagingSenderId: "502032782795",
  appId: "1:502032782795:web:0e3d792971723ddeabd24e",
  measurementId: "G-EMPMSFSTEC"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


export const signInWithGoogle = () => signInWithPopup(auth, provider);