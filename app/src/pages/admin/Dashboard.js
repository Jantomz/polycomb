import { Link } from "react-router-dom";
import Logout from "../../components/auth/Logout.js";
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
  useEffect(() => {
    const performInitialRender = async () => {
      const competitions = await getUserCompetitions({ userId: user.uid });
      setCompetitions(competitions);
      console.log(competitions);
    };
    performInitialRender();
  }, [userData]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {user.photoURL && <img src={user.photoURL} alt="profile"></img>}
      <h2>{user.displayName || user.email}</h2>
      <div>
        {competitions.map((competition) => (
          <button
            onClick={() => {
              navigate(`/competition/${competition.code}`);
            }}
            key={competition._id}
            style={{
              border: "1px solid black",
            }}
          >
            <h3>{competition.title}</h3>
            <p>{competition.description}</p>
            <p>{new Date(competition.startDate).toLocaleDateString()}</p>
            <p>{new Date(competition.endDate).toLocaleDateString()}</p>
          </button>
        ))}
      </div>

      <WordlistGenerator user={user} />

      <WordlistDifficulty user={user} />

      <Link to="create-competition">Create Competition</Link>

      <Logout />
    </div>
  );
};

export default Dashboard;
