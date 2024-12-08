import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import useAuth from "./hooks/useAuth.js";
import AdminDashboard from "./pages/admin/Dashboard.js";
import UserDashboard from "./pages/user/Dashboard.js";

import AdminCompetitionDash from "./pages/admin/competition/CompetitionDash.js";
import UserCompetitionDash from "./pages/user/competition/CompetitionDash.js";

import AdminForm from "./pages/admin/competition/Form.js";
import UserForm from "./pages/user/competition/Form.js";

import Register from "./pages/auth/Register.js";
import Login from "./pages/auth/Login.js";
import { useEffect, useState } from "react";
import CreateCompetition from "./pages/admin/CreateCompetition.js";
import AdminEditSchedule from "./pages/admin/competition/AdminEditSchedule.js";
import AdminEditTimeline from "./pages/admin/competition/AdminEditTimeline.js";
import AdminEditChecklist from "./pages/admin/competition/AdminEditChecklist.js";
import AdminEditPosts from "./pages/admin/competition/AdminEditPosts.js";
import AdminNewPost from "./pages/admin/competition/AdminNewPost.js";
import AdminEditTemplates from "./pages/admin/competition/AdminEditTemplates.js";
import AdminNewTemplate from "./pages/admin/competition/AdminNewTemplate.js";
import AdminCreateWordlist from "./pages/admin/competition/AdminCreateWordlist.js";
import AdminEditWordlist from "./pages/admin/competition/AdminEditWordlist.js";
import ViewWordlist from "./pages/user/competition/ViewWordlist.js";
import WordlistPractice from "./pages/user/competition/WordlistPractice.js";
import useApi from "./hooks/useApi.js";

// TODO: Make the ability to delete and update objects, partially
// TODO: Make sure to delete files or objects fully, including their related ids from other objects

// TODO: For everything, make sure there is validation and error handling, since it completely crashes when backend is not up

function App() {
  const user = useAuth();
  const { getUser, createUser } = useApi();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("User: ", user);

    if (user) {
      // Check if user is an admin
      const fetchUserData = async () => {
        try {
          const data = await getUser({ uid: user.uid });
          if (data.length === 1) {
            console.log("User data: ", data[0]);
            const userData = data[0];
            setUserData(userData);
            if (userData.role === "admin") {
              console.log("User is an admin");
            } else {
              console.log("User is not an admin");
            }
          } else {
            const createdUserData = await createUser(user);
            console.error("User not found");
            console.log("User created: ", createdUserData);
            setUserData(createdUserData);
          }
        } catch (error) {
          console.error("Error fetching or creating user data: ", error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminDashboard user={user} userData={userData} />
                ) : (
                  <UserDashboard
                    user={user}
                    userData={userData}
                    setUserData={setUserData}
                  />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/create-competition"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <CreateCompetition
                    user={user}
                    userData={userData}
                    setUserData={setUserData}
                  />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminCompetitionDash user={user} userData={userData} />
                ) : (
                  <UserCompetitionDash user={user} userData={userData} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-schedule"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditSchedule user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-timeline"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditTimeline user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-checklist"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditChecklist user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/form/:templateId"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminForm user={user} userData={userData} />
                ) : (
                  <UserForm user={user} userData={userData} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-posts"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditPosts user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-posts/new"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminNewPost user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-templates"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditTemplates user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/edit-templates/new"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminNewTemplate user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/add-wordlist"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminCreateWordlist user={user} userData={userData} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/wordlist/:wordlistId"
            element={
              user ? (
                userData && userData.role === "admin" ? (
                  <AdminEditWordlist user={user} userData={userData} />
                ) : (
                  <ViewWordlist user={user} userData={userData} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/wordlist/:wordlistId/practice"
            element={
              user && userData ? (
                <WordlistPractice
                  user={user}
                  userData={userData}
                  setUserData={setUserData}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Add other routes here, make a 404 one later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
