import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js"; // Import Firebase authentication instance
import GoogleLogin from "./GoogleLogin.js"; // Import GoogleLogin component

const RegisterForm = () => {
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store password input
  const [error, setError] = useState(null); // State to store error messages

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear previous errors
    try {
      // Attempt to create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // Handle different error codes from Firebase
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("The email address is already in use by another account.");
          break;
        case "auth/invalid-credential":
          setError("The email address or password is not valid.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled.");
          break;
        case "auth/weak-password":
          setError("The password is too weak.");
          break;
        default:
          setError(err.message);
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
      {/* Display error message if any */}
      <form onSubmit={handleRegister} className="space-y-4 mb-4">
        <input
          autoComplete="off"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on input change
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white font-bold py-2 rounded-md hover:bg-red-600 focus:outline-none hover:ring-2 hover:ring-red-500"
        >
          Register
        </button>
      </form>
      <GoogleLogin />{" "}
      {/* Include GoogleLogin component for alternative sign-up method */}
    </div>
  );
};

export default RegisterForm;
