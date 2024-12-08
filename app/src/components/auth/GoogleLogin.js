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

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
};

export default GoogleLogin;
