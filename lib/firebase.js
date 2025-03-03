// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLKj7DbyCVYzX05evE0I8gQFNzsQwIzzM",
  authDomain: "frame-of-mind-c09e6.firebaseapp.com",
  projectId: "frame-of-mind-c09e6",
  storageBucket: "frame-of-mind-c09e6.firebasestorage.app",
  messagingSenderId: "615124235277",
  appId: "1:615124235277:web:9ab01efa2660334f939144",
  measurementId: "G-YG3DVXRF3S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, app, db };