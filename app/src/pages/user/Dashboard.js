import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../../components/auth/Logout.js";
import JoinPopup from "../../components/misc/JoinPopup.js";
import useApi from "../../hooks/useApi.js";

const Dashboard = ({ user, userData, setUserData }) => {
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const { getUserCompetitions } = useApi();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  useEffect(() => {
    const performInitialRender = async () => {
      const competitions = await getUserCompetitions({ userId: user.uid });
      setCompetitions(competitions);
      console.log(competitions);
    };
    performInitialRender();
  }, [userData]);

  return (
    <div className="p-8 min-h-screen">
      <section className="mb-12">
        <h1 className="text-6xl font-bold mb-12 text-center text-gray-900">
          Dashboard
        </h1>
        {user.photoURL && (
          <div className="flex justify-center mb-8">
            <img
              src={user.photoURL}
              alt="profile"
              className="rounded-full w-32 h-32"
            />
          </div>
        )}
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          {user.displayName || user.email}
        </h2>
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setShowJoinPopup(true);
            }}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            Join Competition
          </button>
        </div>
        {showJoinPopup && (
          <JoinPopup
            user={user}
            userData={userData}
            setUserData={setUserData}
            setShowJoinPopup={setShowJoinPopup}
          />
        )}
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">
          Your Competitions
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {competitions.map((competition) => (
            <button
              onClick={() => {
                navigate(`/competition/${competition.code}`);
              }}
              key={competition._id}
              className="border-4 border-yellow-200 p-4 rounded-lg bg-yellow-300 hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-black mb-2">
                {competition.title}
              </h3>
              <p className="text-sm font-normal text-gray-800 mb-1">
                {competition.description}
              </p>
              <p className="text-sm font-normal text-gray-800 mb-1">
                Start Date:{" "}
                {new Date(competition.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-normal text-gray-800">
                End Date: {new Date(competition.endDate).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
