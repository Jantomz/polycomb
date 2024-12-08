import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js"; // Adjust path if needed

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      if (err.code === "auth/network-request-failed") {
        console.error("Network error, please try again later.");
      } else if (err.code === "auth/user-token-expired") {
        console.error("Session expired, please log in again.");
      } else {
        console.error("Error logging out", err);
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 hover:text-orange-900 font-bold"
    >
      Log Out
    </button>
  );
};

export default Logout;
