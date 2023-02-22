// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1iH3d_9kTMG7M1Sxz1fKfzq7rfXOeogE",
  authDomain: "ngoc-trams-project.firebaseapp.com",
  projectId: "ngoc-trams-project",
  storageBucket: "ngoc-trams-project.appspot.com",
  messagingSenderId: "59561988062",
  appId: "1:59561988062:web:2634a2967d52fd99a4174f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;