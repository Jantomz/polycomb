import { signOut } from "firebase/auth"; // Import the signOut function from Firebase authentication
import { auth } from "../../firebase.js"; // Import the auth instance from the firebase configuration file

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Attempt to sign out the user using Firebase authentication
    } catch (err) {
      // Handle different error cases
      if (err.code === "auth/network-request-failed") {
        console.error("Network error, please try again later."); // Log network error
      } else if (err.code === "auth/user-token-expired") {
        console.error("Session expired, please log in again."); // Log session expiration error
      } else {
        console.error("Error logging out", err); // Log any other errors
      }
    }
  };

  return (
    <button
      onClick={handleLogout} // Attach the handleLogout function to the button's onClick event
      className="py-2 px-4 hover:text-orange-900 font-bold" // Apply some styling to the button
    >
      Log Out
    </button>
  );
};

export default Logout; // Export the Logout component as the default export
