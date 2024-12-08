import { Link } from "react-router-dom";
import Logout from "../auth/Logout.js";

const Navbar = ({ user, userData }) => {
  return (
    <nav className="w-screen bg-orange-300">
      <ul className="flex justify-between items-center gap-4 p-4">
        {user && (
          <>
            <Link to="/" className="text-3xl font-bold">
              Polycomb
            </Link>
            <div className="flex gap-3 items-center">
              <h2 className="">
                You are signed in as{" "}
                <span className="font-bold">
                  {user.displayName || user.email}
                </span>
              </h2>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="profile"
                  style={{
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                ></img>
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
