import useApi from "../../hooks/useApi.js"; // Import custom hook for API calls

const JoinPopup = ({ user, setUserData, setShowJoinPopup }) => {
  const { addCompetition, addParticipant } = useApi(); // Destructure API functions from useApi hook

  const handleJoinCompetition = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const code = e.target.code.value; // Get competition code from form input
    const userId = user.uid; // Get user ID from user prop

    try {
      const updatedUser = await addCompetition({ code, userId }); // Call API to add competition

      if (updatedUser.error) {
        console.error(
          "Error joining competition:",
          updatedUser.error.message || updatedUser.error
        );
        alert("Failed to join competition. Please try again.");
        return; // Exit function if there's an error
      }

      const competition = await addParticipant({ code, userId }); // Call API to add participant to competition

      if (competition.error) {
        console.error(
          "Error adding participant to competition:",
          competition.error.message || competition.error
        );
        alert("Failed to add participant to competition. Please try again.");
        return; // Exit function if there's an error
      }

      setUserData(updatedUser); // Update user data state with the new data
      setShowJoinPopup(false); // Close the join popup
    } catch (error) {
      console.error("Unexpected error:", error); // Log unexpected errors
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Join a Competition
        </h1>
        <form onSubmit={(e) => handleJoinCompetition(e)} className="space-y-4">
          <input
            type="number"
            name="code"
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter competition code" // Placeholder text for the input field
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => setShowJoinPopup(false)} // Close the popup when clicked
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinPopup; // Export the component as default
