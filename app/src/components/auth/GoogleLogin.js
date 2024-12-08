import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js"; // Adjust path if needed

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login successful", user);
    } catch (error) {
      console.error("Error with Google login", error);
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
