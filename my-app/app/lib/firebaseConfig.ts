// Importa Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyAuq4G0EL8SLL2NQZm0FqrjogjXbbRG0c0",
  authDomain: "barbearia-app-4d4dc.firebaseapp.com",
  projectId: "barbearia-app-4d4dc",
  storageBucket: "barbearia-app-4d4dc.appspot.com",
  messagingSenderId: "163737712420",
  appId: "1:163737712420:web:4cb079fd7e97c0e04ea5b1",
  measurementId: "G-TJN9SFVPC4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
