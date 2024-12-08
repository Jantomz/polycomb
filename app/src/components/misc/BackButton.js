import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  if (
    currentPath === "/login" ||
    currentPath === "/" ||
    currentPath === "/register"
  ) {
    return null;
  }
  return (
    <div className="w-full text-left py-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded "
      >
        Back
      </button>
    </div>
  );
};

export default BackButton;
