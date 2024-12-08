import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js"; // Import the Firebase authentication instance

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Create a new GoogleAuthProvider instance
    try {
      await signInWithPopup(auth, provider); // Open a popup for Google sign-in
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.error(
          "The popup was closed by the user before completing the sign in."
        ); // Handle case where user closes the popup
      } else if (error.code === "auth/cancelled-popup-request") {
        console.error("Only one popup request is allowed at one time."); // Handle case where multiple popups are requested
      } else if (error.code === "auth/network-request-failed") {
        console.error("Network error occurred during the sign in."); // Handle network errors
      } else {
        console.error("Error with Google login", error); // Handle other errors
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin} // Attach the Google login handler to the button's onClick event
      className="text-red-800 hover:text-red-900 hover:bg-red-400/30  font-bold py-2 px-4 rounded border-red-300 border-2" // Styling for the button
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLogin; // Export the GoogleLogin component as the default export
