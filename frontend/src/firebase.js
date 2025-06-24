// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAc5hA_PZ9M4mptqrxmvpAa5TVS53PGAzs",
  authDomain: "foodonate-25f1c.firebaseapp.com",
  projectId: "foodonate-25f1c",
  storageBucket: "foodonate-25f1c.firebasestorage.app",
  messagingSenderId: "835952180916",
  appId: "1:835952180916:web:9925cc91a36f739c10a1e1"
};
export const firebaseApp = initializeApp(firebaseConfig);
