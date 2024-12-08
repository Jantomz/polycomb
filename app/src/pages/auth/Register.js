import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm.js";

const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <RegisterForm />
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default Register;
