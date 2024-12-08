import useApi from "../../hooks/useApi.js";

const JoinPopup = ({ user, userData, setUserData, setShowJoinPopup }) => {
  const { addCompetition, addParticipant } = useApi();

  const handleJoinCompetition = async (e) => {
    e.preventDefault();

    const code = e.target.code.value;
    const userId = user.uid;

    const updatedUser = await addCompetition({ code, userId });

    if (updatedUser.error) {
      console.log("Error joining competition", updatedUser.error);
      return;
    }

    const competition = await addParticipant({ code, userId });

    if (competition.error) {
      console.log("Error adding participant to competition", competition.error);
      return;
    }

    setUserData(updatedUser);
    setShowJoinPopup(false);

    console.log("Joining competition", updatedUser);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Join a Competition
        </h1>
        <form onSubmit={(e) => handleJoinCompetition(e)} className="space-y-4">
          <input
            type="number"
            name="code"
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter competition code"
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
              onClick={() => setShowJoinPopup(false)}
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

export default JoinPopup;
