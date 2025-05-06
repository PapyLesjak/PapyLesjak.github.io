// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGwEuzsGc05UJ8ABScDtslGo5fO3BoU7w",
    authDomain: "maturitetni-izdelek.firebaseapp.com",
    projectId: "maturitetni-izdelek",
    storageBucket: "maturitetni-izdelek.firebasestorage.app",
    messagingSenderId: "408495253065",
    appId: "1:408495253065:web:a05e2cb67d6e8fc4e34198",
    measurementId: "G-KR6PX5C975"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase modules for use in other files
export { app, auth, db };