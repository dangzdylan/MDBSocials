// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmXVmrefG1R8fTmzipEoo_N9enQTzEX7Q",
  authDomain: "mdb-socials-7f6a2.firebaseapp.com",
  projectId: "mdb-socials-7f6a2",
  storageBucket: "mdb-socials-7f6a2.appspot.com",
  messagingSenderId: "930785996820",
  appId: "1:930785996820:web:24fc5bf72165a6f2be7701",
  measurementId: "G-WJB7V6H3RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);