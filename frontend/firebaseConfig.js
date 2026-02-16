// frontend/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Correct import

const firebaseConfig = {
  apiKey: "AIzaSyApmqvvzvq2IoIUqSfWI60L9qg7JUkZsCQ",
  authDomain: "smart-agri-plus.firebaseapp.com",
  projectId: "smart-agri-plus",
  storageBucket: "smart-agri-plus.appspot.com",
  messagingSenderId: "175443715706",
  appId: "1:175443715706:android:9fbf8c2d989248b81c7dc3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);