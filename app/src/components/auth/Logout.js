import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js"; // Adjust path if needed

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Error logging out", err);
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
