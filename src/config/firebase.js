import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for Brandzo ERP
// Replace the placeholder values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWhqQVdhODZT0bdXnbyYzcmpnv11s9qoU",
  authDomain: "brandzo-erp-2026.firebaseapp.com",
  projectId: "brandzo-erp-2026",
  storageBucket: "brandzo-erp-2026.firebasestorage.app",
  messagingSenderId: "991460523040",
  appId: "1:991460523040:web:d3c6f76b1ff13a1ab8d045"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default db;
