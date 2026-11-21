// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZY_eDu-NgUTPYP5eCUssUHp5VqfS2FXI",
  authDomain: "entregaflow-3d724.firebaseapp.com",
  projectId: "entregaflow-3d724",
  storageBucket: "entregaflow-3d724.firebasestorage.app",
  messagingSenderId: "132341707276",
  appId: "1:132341707276:web:7c7b0c5fdcefb25d787429",
  measurementId: "G-NG7N4RQTGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);