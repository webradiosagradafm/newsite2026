import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhWgMGAk9n8zIjWl2eyB2_qh5q_rQseJY",
  authDomain: "praise-f-m-united-6gnmd7.firebaseapp.com",
  projectId: "praise-f-m-united-6gnmd7",
  storageBucket: "praise-f-m-united-6gnmd7.firebasestorage.app",
  messagingSenderId: "981444238375",
  appId: "1:981444238375:web:93a2c2ff5e0dfafe2b4202",
  measurementId: "G-R042FME1MS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);