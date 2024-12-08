import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm.js";

const Login = () => {
  return (
    <div className="h-screen flex flex-col justify-center gap-4">
      <h2 className="font-bold text-5xl">Login</h2>
      <LoginForm />
      <Link to="/register" className="text-red-900 hover:underline">
        Don't have an account? Register
      </Link>
    </div>
  );
};

export default Login;
