import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCvvPGcxd2NbbevdG9fszpdbrNjVQdNsLo",
    authDomain: "catalogo-saffir.firebaseapp.com",
    projectId: "catalogo-saffir",
    storageBucket: "catalogo-saffir.firebasestorage.app",
    messagingSenderId: "83430672696",
    appId: "1:83430672696:web:33d6cab76571d73260d9cd",
    measurementId: "G-PRDDEQNPT7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
