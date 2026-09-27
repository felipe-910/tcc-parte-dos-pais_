// Inicialização do Firebase (SDK modular v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXSLem_MdoExYIsT2U-eV-vPHBZXFPT4g",
  authDomain: "tcc-teste-743d2.firebaseapp.com",
  projectId: "tcc-teste-743d2",
  storageBucket: "tcc-teste-743d2.firebasestorage.app",
  messagingSenderId: "982129634174",
  appId: "1:982129634174:web:6a7f2ad51711515fb7612f",
  measurementId: "G-GG871Y3FLR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
