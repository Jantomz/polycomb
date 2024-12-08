import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js"; // Import the Firebase auth instance

// Custom hook to track user authentication state
const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state based on auth status
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return user; // Return the current user object
};

export default useAuth;
