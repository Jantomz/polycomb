import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm.js";

const Register = () => {
  return (
    <div className="h-screen flex flex-col justify-center gap-4">
      <h2 className="font-bold text-5xl">Register</h2>
      <RegisterForm />
      <Link to="/login" className="text-red-900 hover:underline">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;
