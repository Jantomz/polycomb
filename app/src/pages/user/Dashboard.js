import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinPopup from "../../components/misc/JoinPopup.js";
import useApi from "../../hooks/useApi.js";

const Dashboard = ({ user, userData, setUserData }) => {
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [error, setError] = useState(null);

  const { getUserCompetitions } = useApi();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  useEffect(() => {
    const performInitialRender = async () => {
      try {
        const competitions = await getUserCompetitions({ userId: user.uid });
        setCompetitions(competitions);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
        setError("Failed to fetch competitions. Please try again later.");
      }
    };
    performInitialRender();
  }, [userData]);

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      {showJoinPopup && (
        <JoinPopup
          user={user}
          userData={userData}
          setUserData={setUserData}
          setShowJoinPopup={setShowJoinPopup}
        />
      )}

      <section className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-6xl font-bold mb-8 sm:mb-12 text-center text-gray-900">
          Dashboard
        </h1>
        {user.photoURL && (
          <div className="flex justify-center mb-4 sm:mb-8">
            <img
              src={user.photoURL}
              alt="profile"
              className="rounded-full w-24 h-24 sm:w-32 sm:h-32"
            />
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-center text-gray-800">
          {user.displayName || user.email}
        </h2>
        <div className="text-center mb-4 sm:mb-8">
          <button
            onClick={() => {
              setShowJoinPopup(true);
            }}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            Join Competition
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-gray-800">
          Your Competitions
        </h2>
        {error && (
          <div className="text-red-500 text-center mb-4 sm:mb-8">{error}</div>
        )}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {competitions.map((competition) => (
            <button
              onClick={() => {
                navigate(`/competition/${competition.code}`);
              }}
              key={competition._id}
              className="border-2 sm:border-4 border-yellow-200 p-2 sm:p-4 rounded-lg bg-yellow-300 hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2">
                {competition.title}
              </h3>
              <p className="text-xs sm:text-sm font-normal text-gray-800 mb-1">
                {competition.description}
              </p>
              <p className="text-xs sm:text-sm font-normal text-gray-800 mb-1">
                Start Date:{" "}
                {new Date(competition.startDate).toLocaleDateString()}
              </p>
              <p className="text-xs sm:text-sm font-normal text-gray-800">
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
