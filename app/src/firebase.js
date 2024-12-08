// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAj-64qBb4cQspsLXGrvpw4usjgcMF3Q1w",
  authDomain: "polycomb-5555e.firebaseapp.com",
  projectId: "polycomb-5555e",
  storageBucket: "polycomb-5555e.firebasestorage.app",
  messagingSenderId: "1029072504210",
  appId: "1:1029072504210:web:92e756a9c2d5d36884ed4b",
  measurementId: "G-PYRB7V90BD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
