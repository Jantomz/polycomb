import { Link } from "react-router-dom"; // Importing Link component for navigation
import RegisterForm from "../../components/auth/RegisterForm.js"; // Importing the RegisterForm component

const Register = () => {
  return (
    <div className="h-screen flex flex-col justify-center gap-4">
      {/* Container div with full screen height, flexbox layout, and centered content */}
      <h2 className="font-bold text-5xl">Register</h2>
      {/* Heading for the register page with bold and large text */}
      <RegisterForm />
      {/* Including the RegisterForm component */}
      <Link to="/login" className="text-red-900 hover:underline">
        {/* Link to the login page with red text and underline on hover */}
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register; // Exporting the Register component as default
