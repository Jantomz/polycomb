import { Link } from "react-router-dom";
import Logout from "../auth/Logout.js";

const Navbar = ({ user, userData }) => {
  return (
    <nav className="w-screen bg-orange-300">
      <ul className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        {user && (
          <>
            <Link to="/" className="text-3xl font-bold">
              Polycomb
            </Link>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <h2 className="text-center md:text-left">
                You are signed in as{" "}
                <span className="font-bold">
                  {user.displayName || user.email}
                </span>
              </h2>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="rounded-full w-8 h-8"
                />
              )}
              <Logout />
            </div>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
