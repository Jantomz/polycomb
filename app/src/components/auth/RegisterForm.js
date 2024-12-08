import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js"; // Adjust path if needed
import GoogleLogin from "./GoogleLogin.js";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Account created");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("The email address is already in use by another account.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled.");
          break;
        case "auth/weak-password":
          setError("The password is too weak.");
          break;
        default:
          setError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4 mb-4">
        <input
          autoComplete="off"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <GoogleLogin />
    </div>
  );
};

export default RegisterForm;
