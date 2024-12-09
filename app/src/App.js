import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"; // Importing necessary components from react-router-dom for routing
import useAuth from "./hooks/useAuth.js"; // Custom hook for authentication
import AdminDashboard from "./pages/admin/Dashboard.js";
import UserDashboard from "./pages/user/Dashboard.js";

import AdminCompetitionDash from "./pages/admin/competition/CompetitionDash.js";
import UserCompetitionDash from "./pages/user/competition/CompetitionDash.js";

import AdminForm from "./pages/admin/competition/Form.js";
import UserForm from "./pages/user/competition/Form.js";

import Register from "./pages/auth/Register.js";
import Login from "./pages/auth/Login.js";
import { useEffect, useState } from "react"; // Importing hooks from React

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

import useApi from "./hooks/useApi.js"; // Custom hook for API calls
import Navbar from "./components/misc/Navbar.js";
import ViewCompetitionPosts from "./pages/ViewCompetitionPosts.js";
import ViewCompetitionSchedule from "./pages/ViewCompetitionSchedule.js";
import ViewCompetitionForms from "./pages/ViewCompetitionForms.js";
import ViewCompetitionFiles from "./pages/ViewCompetitionFiles.js";
import BackButton from "./components/misc/BackButton.js";
import Loading from "./pages/Loading.js";
import NotFound from "./pages/NotFound.js";

function App() {
  const user = useAuth(); // Get the authenticated user
  const { getUser, createUser } = useApi(); // Destructure API functions

  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        // Check if user is authenticated
        try {
          const data = await getUser({ uid: user.uid }); // Fetch user data from API
          if (data.length === 1) {
            setUserData(data[0]); // Set user data if found
          } else {
            const createdUserData = await createUser({ user }); // Create new user if not found
            setUserData(createdUserData);
          }
        } catch (error) {
          console.error("Error fetching or creating user data: ", error);
          setError(
            "Failed to fetch or create user data. Please try again later."
          );
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      } else {
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/register"
        ) {
          setLoading(false); // Set loading to false if on login or register page
        }
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, [user]); // Dependency array to re-run effect when user changes

  const renderRoute = (adminComponent, userComponent) => {
    return user ? (
      userData && userData.role === "admin" ? (
        adminComponent // Render admin component if user is admin
      ) : (
        userComponent // Render user component if user is not admin
      )
    ) : (
      <Navigate to="/login" /> // Redirect to login if user is not authenticated
    );
  };

  if (loading) {
    return <Loading />; // Show loading component while fetching user data
  }

  if (error) {
    return <div className="error">{error}</div>; // Show error message if there's an error
  }

  return (
    <Router>
      <Navbar user={user} /> {/* Navbar component */}
      <div className="App p-12 max-md:p-4 min-h-screen bg-yellow-100">
        <BackButton /> {/* Back button component */}
        <Routes>
          <Route
            path="/"
            element={renderRoute(
              <AdminDashboard user={user} userData={userData} />,
              <UserDashboard
                user={user}
                userData={userData}
                setUserData={setUserData}
              />
            )}
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
            element={renderRoute(
              <CreateCompetition
                user={user}
                userData={userData}
                setUserData={setUserData}
              />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code"
            element={renderRoute(
              <AdminCompetitionDash user={user} userData={userData} />,
              <UserCompetitionDash user={user} userData={userData} />
            )}
          />
          <Route
            path="/competition/:code/edit-schedule"
            element={renderRoute(
              <AdminEditSchedule user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/edit-timeline"
            element={renderRoute(
              <AdminEditTimeline user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/edit-checklist"
            element={renderRoute(
              <AdminEditChecklist user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/form/:templateId"
            element={renderRoute(
              <AdminForm user={user} userData={userData} />,
              <UserForm user={user} userData={userData} />
            )}
          />
          <Route
            path="/competition/:code/edit-posts"
            element={renderRoute(
              <AdminEditPosts user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/edit-posts/new"
            element={renderRoute(
              <AdminNewPost user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/edit-templates"
            element={renderRoute(
              <AdminEditTemplates user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/edit-templates/new"
            element={renderRoute(
              <AdminNewTemplate user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/add-wordlist"
            element={renderRoute(
              <AdminCreateWordlist user={user} userData={userData} />,
              <Navigate to="/" />
            )}
          />
          <Route
            path="/competition/:code/wordlist/:wordlistId"
            element={renderRoute(
              <AdminEditWordlist user={user} userData={userData} />,
              <ViewWordlist user={user} userData={userData} />
            )}
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
          <Route
            path="/competition/:code/posts"
            element={
              user && userData ? (
                <ViewCompetitionPosts user={user} userData={userData} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/schedule"
            element={
              user && userData ? (
                <ViewCompetitionSchedule user={user} userData={userData} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/forms"
            element={
              user && userData ? (
                <ViewCompetitionForms user={user} userData={userData} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/competition/:code/files"
            element={
              user && userData ? (
                <ViewCompetitionFiles user={user} userData={userData} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<NotFound />} /> {/* 404 Not Found route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
