import React, { useState } from "react"; // Import React and useState hook
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase authentication function
import { auth } from "../../firebase.js"; // Import Firebase auth instance
import GoogleLogin from "./GoogleLogin.js"; // Import GoogleLogin component

const LoginForm = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(null); // State for error messages

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from submitting the default way
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password); // Attempt to sign in with email and password
    } catch (err) {
      // Handle different error codes from Firebase
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address."); // Set error message for invalid email
          break;
        case "auth/user-disabled":
          setError("User account is disabled."); // Set error message for disabled user
          break;
        case "auth/user-not-found":
          setError("No user found with this email."); // Set error message for user not found
          break;
        case "auth/wrong-password":
          setError("Incorrect password."); // Set error message for wrong password
          break;
        default:
          setError("An unexpected error occurred. Please try again."); // Set error message for any other errors
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {" "}
      {/* Container for the login form */}
      {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
      {/* Display error message if any */}
      <form onSubmit={handleLogin} className="space-y-4 mb-4">
        {" "}
        {/* Form submission handler */}
        <input
          autoComplete="off"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on change
          placeholder="Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white font-bold py-2 rounded-md hover:bg-red-600 focus:outline-none hover:ring-2 hover:ring-red-500"
        >
          Login
        </button>
      </form>
      <GoogleLogin /> {/* Include Google login button */}
    </div>
  );
};

export default LoginForm; // Export the LoginForm component
