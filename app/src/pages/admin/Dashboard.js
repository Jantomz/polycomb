import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi.js";
import { useNavigate } from "react-router-dom";
import WordlistGenerator from "../../components/wordlist/WordlistGenerator.js";
import WordlistDifficulty from "../../components/wordlist/WordlistDifficulty.js";
/* eslint-disable react-hooks/exhaustive-deps */

const Dashboard = ({ user, userData }) => {
  const { getUserCompetitions } = useApi();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [error, setError] = useState(null);

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
    <div className="p-4 md:p-8 min-h-screen">
      <section className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-12 text-center text-gray-900">
          Admin Dashboard
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800">
          Your Competitions
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="flex flex-wrap gap-4 justify-center">
          {competitions.map((competition) => (
            <button
              onClick={() => {
                navigate(`/competition/${competition.code}`);
              }}
              key={competition._id}
              className="border-4 border-yellow-200 p-4 rounded-lg bg-yellow-300 hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
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
        <div className="mt-8 text-center">
          <Link
            to="create-competition"
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            Create Competition
          </Link>
        </div>
      </section>

      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
        Wordlist Tools
      </h2>
      <section className="flex flex-col gap-4 justify-center items-center">
        <WordlistGenerator user={user} />
        <WordlistDifficulty user={user} />
      </section>
    </div>
  );
};

export default Dashboard;
