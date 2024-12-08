import { useNavigate } from "react-router-dom"; // Importing the useNavigate hook from react-router-dom

const BackButton = () => {
  const navigate = useNavigate(); // Initializing the navigate function to programmatically navigate
  const currentPath = window.location.pathname; // Getting the current URL path

  // Check if the current path is one of the specified paths
  if (
    currentPath === "/login" ||
    currentPath === "/" ||
    currentPath === "/register"
  ) {
    return null; // If true, do not render the BackButton component
  }

  return (
    <div className="w-full text-left py-6">
      {" "}
      {/* Container div with styling */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page in history when clicked
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded " // Button styling
      >
        Back
      </button>
    </div>
  );
};

export default BackButton; // Exporting the BackButton component as default
