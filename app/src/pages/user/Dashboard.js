import { useEffect, useState } from "react";
import Logout from "../../components/auth/Logout.js";
import JoinPopup from "../../components/misc/JoinPopup.js";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h1>Dashboard</h1>
      {user.photoURL && <img src={user.photoURL} alt="profile"></img>}
      <h2>{user.displayName || user.email}</h2>
      <button
        onClick={() => {
          setShowJoinPopup(true);
        }}
      >
        Join Competition
      </button>
      {showJoinPopup && (
        <JoinPopup
          user={user}
          userData={userData}
          setUserData={setUserData}
          setShowJoinPopup={setShowJoinPopup}
        />
      )}

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

      <Logout />
    </div>
  );
};

export default Dashboard;
