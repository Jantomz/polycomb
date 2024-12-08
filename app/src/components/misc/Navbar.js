import { Link } from "react-router-dom"; // Importing Link component for navigation
import Logout from "../auth/Logout.js"; // Importing Logout component

const Navbar = ({ user }) => {
  return (
    <nav className="w-screen bg-orange-300">
      {" "}
      {/* Navbar with full width and orange background */}
      <ul className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        {" "}
        {/* Flexbox for responsive layout */}
        <Link
          to="/"
          className="text-3xl font-bold hover:text-yellow-600 transition-all" // Link to home with hover effect
        >
          Polycomb
        </Link>
        {user && ( // Conditional rendering if user is logged in
          <>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              {" "}
              {/* Flexbox for user info and logout */}
              <h2 className="text-center md:text-left">
                {" "}
                {/* Responsive text alignment */}
                You are signed in as{" "}
                <span className="font-bold">
                  {user.displayName || user.email}{" "}
                  {/* Display user's name or email */}
                </span>
              </h2>
              {user.photoURL && ( // Conditional rendering for user's profile picture
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="rounded-full w-8 h-8" // Profile picture styling
                />
              )}
              <Logout /> {/* Logout component */}
            </div>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; // Exporting Navbar component
