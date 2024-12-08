import { useEffect, useState } from "react"; // Importing hooks from React
import { useNavigate } from "react-router-dom"; // Importing navigation hook from react-router-dom
import JoinPopup from "../../components/misc/JoinPopup.js"; // Importing JoinPopup component
import useApi from "../../hooks/useApi.js"; // Importing custom hook for API calls

const Dashboard = ({ user, userData, setUserData }) => {
  const [showJoinPopup, setShowJoinPopup] = useState(false); // State to control the visibility of JoinPopup
  const [error, setError] = useState(null); // State to handle errors

  const { getUserCompetitions } = useApi(); // Destructuring getUserCompetitions function from useApi hook
  const navigate = useNavigate(); // Initializing navigate function

  const [competitions, setCompetitions] = useState([]); // State to store competitions data
  useEffect(() => {
    const performInitialRender = async () => {
      try {
        const competitions = await getUserCompetitions({ userId: user.uid }); // Fetching competitions for the user
        setCompetitions(competitions); // Updating state with fetched competitions
      } catch (err) {
        console.error("Failed to fetch competitions:", err); // Logging error to console
        setError("Failed to fetch competitions. Please try again later."); // Setting error message
      }
    };
    performInitialRender(); // Calling the async function
  }, [userData]); // Dependency array to re-run effect when userData changes

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      {showJoinPopup && (
        <JoinPopup
          user={user}
          userData={userData}
          setUserData={setUserData}
          setShowJoinPopup={setShowJoinPopup} // Passing props to JoinPopup component
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
              className="rounded-full w-24 h-24 sm:w-32 sm:h-32" // Displaying user's profile picture
            />
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-center text-gray-800">
          {user.displayName || user.email}
        </h2>
        <div className="text-center mb-4 sm:mb-8">
          <button
            onClick={() => {
              setShowJoinPopup(true); // Showing JoinPopup when button is clicked
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
          <div className="text-red-500 text-center mb-4 sm:mb-8">{error}</div> // Displaying error message if any
        )}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {competitions.map((competition) => (
            <button
              onClick={() => {
                navigate(`/competition/${competition.code}`); // Navigating to competition details page
              }}
              key={competition._id} // Unique key for each competition
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
                End Date: {new Date(competition.endDate).toLocaleDateString()}{" "}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; // Exporting Dashboard component
