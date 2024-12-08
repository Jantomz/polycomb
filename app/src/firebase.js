// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration object containing keys and identifiers for your app
const firebaseConfig = {
  apiKey: "AIzaSyAj-64qBb4cQspsLXGrvpw4usjgcMF3Q1w", // API key for authenticating requests
  authDomain: "polycomb-5555e.firebaseapp.com", // Auth domain for Firebase Authentication
  projectId: "polycomb-5555e", // Project ID for your Firebase project
  storageBucket: "polycomb-5555e.firebasestorage.app", // Storage bucket for Firebase Storage
  messagingSenderId: "1029072504210", // Sender ID for Firebase Cloud Messaging
  appId: "1:1029072504210:web:92e756a9c2d5d36884ed4b", // App ID for the Firebase app
  measurementId: "G-PYRB7V90BD", // Measurement ID for Google Analytics
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export the auth object to use it in other parts of the application
export { auth };
