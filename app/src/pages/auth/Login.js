import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm.js";

const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm />
      <Link to="/register">Don't have an account? Register</Link>
    </div>
  );
};

export default Login;
