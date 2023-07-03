// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'dotenv'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEYS,
  authDomain: "asociacion-mendocina-atletismo.firebaseapp.com",
  projectId: "asociacion-mendocina-atletismo",
  storageBucket: "gs://asociacion-mendocina-atletismo.appspot.com",
  messagingSenderId: "705734067673",
  appId: "1:705734067673:web:0de577c9034cb7b5f445c8",
  measurementId: "G-LEJG0PCR8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);