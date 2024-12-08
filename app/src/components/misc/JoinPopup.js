import useApi from "../../hooks/useApi.js";

const JoinPopup = ({ user, userData, setUserData, setShowJoinPopup }) => {
  const { addCompetition, addParticipant } = useApi();

  const handleJoinCompetition = async (e) => {
    e.preventDefault();

    // Get the competition code from the form
    const code = e.target.code.value;

    // Get the user ID from the user object
    const userId = user.uid;

    // Call the addCompetition function from useApi
    // Pass the competition code and the user ID
    const updatedUser = await addCompetition({ code, userId });

    // Set the user data in the state

    if (updatedUser.error) {
      console.log("Error joining competition", updatedUser.error);
      return;
    }

    const competition = await addParticipant({ code, userId });

    console.log("Competition: ", competition);

    // Set up proper error handling
    if (competition.error) {
      console.log("Error adding participant to competition", competition.error);
      return;
    }

    setUserData(updatedUser);

    // Close the join popup
    setShowJoinPopup(false);

    console.log("Joining competition", updatedUser);
  };

  return (
    <div className="">
      <h1>Join a Competition</h1>
      <form onSubmit={(e) => handleJoinCompetition(e)}>
        <input type="number" name="code"></input>
        <button type="submit">Join</button>
        <button type="button" onClick={() => setShowJoinPopup(false)}>
          Close
        </button>
      </form>
    </div>
  );
};

export default JoinPopup;
