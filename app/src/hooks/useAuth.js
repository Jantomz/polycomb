import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js"; // Import the Firebase auth instance

// Custom hook to track user authentication state
const useAuth = () => {
  const [user, setUser] = useState(null); // Initialize user state as null

  useEffect(() => {
    // Set up listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state when auth state changes
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe(); // Unsubscribe from the listener to prevent memory leaks
  }, []); // Empty dependency array ensures this effect runs only once

  return user; // Return the current user object
};

export default useAuth; // Export the custom hook for use in other components
