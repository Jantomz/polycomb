import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js"; // Adjust path if needed

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.error(
          "The popup was closed by the user before completing the sign in."
        );
      } else if (error.code === "auth/cancelled-popup-request") {
        console.error("Only one popup request is allowed at one time.");
      } else if (error.code === "auth/network-request-failed") {
        console.error("Network error occurred during the sign in.");
      } else {
        console.error("Error with Google login", error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="text-red-800 hover:text-red-900 hover:bg-red-400/30  font-bold py-2 px-4 rounded border-red-300 border-2"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;
