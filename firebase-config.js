// Uvoz Firebase modulov
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Konfiguracija Firebase projekta
const firebaseConfig = {
    apiKey: "AIzaSyA1W3EYXqbkLLRhqNbW60iWFD7g28-kV_Y", // API ključ
    authDomain: "maturitetni-izdelek.firebaseapp.com", // Avtentikacijska domena
    projectId: "maturitetni-izdelek", // ID projekta
    storageBucket: "maturitetni-izdelek.firebasestorage.app", // Shramba
    messagingSenderId: "408495253065", // ID za pošiljanje sporočil
    appId: "1:408495253065:web:a05e2cb67d6e8fc4e34198", // ID aplikacije
    measurementId: "G-KR6PX5C975" // ID za meritve
};

// Inicializacija Firebase aplikacije
const app = initializeApp(firebaseConfig); // Inicializiraj Firebase aplikacijo
const auth = getAuth(app); // Inicializiraj Firebase avtentikacijo
const db = getFirestore(app); // Inicializiraj Firebase Firestore (bazo podatkov)

// Izvoz Firebase modulov za uporabo v drugih datotekah
export { app, auth, db };