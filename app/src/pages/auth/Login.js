import { Link } from "react-router-dom"; // Importing Link component for navigation
import LoginForm from "../../components/auth/LoginForm.js"; // Importing the LoginForm component

const Login = () => {
  return (
    <div className="h-screen flex flex-col justify-center gap-4">
      {/* Full height container with flexbox for vertical alignment and spacing */}
      <h2 className="font-bold text-5xl">Login</h2>
      {/* Heading for the login page */}
      <LoginForm />
      {/* Rendering the LoginForm component */}
      <Link to="/register" className="text-red-900 hover:underline">
        {/* Link to the registration page with styling */}
        Don't have an account? Register
      </Link>
    </div>
  );
};

export default Login; // Exporting the Login component as default
