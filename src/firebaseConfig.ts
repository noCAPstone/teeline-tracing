// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import for Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2TPUyNqYDP-3ebM2bQ-Kx3CJVeb-zlEw",
  authDomain: "teeline-tracer.firebaseapp.com",
  projectId: "teeline-tracer",
  storageBucket: "teeline-tracer.firebasestorage.app",
  messagingSenderId: "1039627863544",
  appId: "1:1039627863544:web:79a76cb451f01ce471820d",
  measurementId: "G-WY00H60KMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { app, db };