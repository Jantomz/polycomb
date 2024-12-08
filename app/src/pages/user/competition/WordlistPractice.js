import { useNavigate, useParams } from "react-router-dom"; // Importing hooks from react-router-dom for navigation and URL parameters
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls
import { useEffect, useState } from "react"; // Importing React hooks

const WordlistPractice = ({ user, userData, setUserData }) => {
  const competitionCode = useParams().code; // Extracting competition code from URL parameters
  const wordlistId = useParams().wordlistId; // Extracting wordlist ID from URL parameters
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index in the wordlist
  const [order, setOrder] = useState([]); // State to store the randomized order of words
  const [currentWord, setCurrentWord] = useState(null); // State to store the current word object
  const [wordlist, setWordlist] = useState(null); // State to store the entire wordlist
  const [usersGuess, setUsersGuess] = useState(""); // State to store the user's guess
  const [isIncorrect, setIsIncorrect] = useState(false); // State to track if the user's guess is incorrect
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to store any error messages

  const navigate = useNavigate(); // Hook for navigation

  const { getWordlist, setWordlistPractice, getWord } = useApi(); // Destructuring API functions from custom hook

  const uploadWordlistPractice = async ({
    orderUpload,
    currentIndexUpload,
  }) => {
    try {
      const res = await setWordlistPractice({
        wordlistId,
        userId: user.uid,
        order: orderUpload,
        currentIndex: currentIndexUpload,
      });
      return res;
    } catch (err) {
      console.error("Error uploading wordlist practice", err);
      setError("Failed to upload wordlist practice. Please try again.");
    }
  };

  const randomizeArrayIndex = (arr) => {
    const indexArray = arr.map((_, index) => index); // Create an array of indices

    for (let i = indexArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Randomly swap elements
      [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
    }

    return indexArray; // Return the randomized array of indices
  };

  const nextWord = async () => {
    setLoading(true); // Set loading state to true
    try {
      if (currentIndex === order.length - 1) {
        // Check if the current word is the last in the order
        let currO = randomizeArrayIndex(wordlist.words); // Randomize the order again
        setCurrentIndex(0); // Reset current index
        setOrder(currO); // Set new order
        setUserData(
          await uploadWordlistPractice({
            orderUpload: currO,
            currentIndexUpload: 0,
          })
        );
        alert("End of wordlist"); // Alert user that the wordlist has ended
        navigate(`/competition/${competitionCode}/wordlist/${wordlistId}`); // Navigate to the wordlist page
      } else {
        setCurrentIndex(currentIndex + 1); // Increment current index
        setUserData(
          await uploadWordlistPractice({
            orderUpload: order,
            currentIndexUpload: currentIndex + 1,
          })
        );
      }

      const wordId = wordlist.words[order[currentIndex + 1]]; // Get the next word ID

      const word = await getWord({ wordId }); // Fetch the next word

      setCurrentWord(word); // Set the current word

      setUsersGuess(""); // Reset user's guess
      setIsIncorrect(false); // Reset incorrect state
    } catch (err) {
      console.error("Error fetching next word", err);
      setError("Failed to fetch the next word. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const checkWord = () => {
    if (usersGuess === currentWord.word) {
      // Check if user's guess matches the current word
      nextWord(); // Fetch the next word
    } else {
      setIsIncorrect(true); // Set incorrect state to true
    }
  };

  useEffect(() => {
    const fetchWordlist = async () => {
      try {
        const innerWordlist = await getWordlist({
          competitionCode,
          wordlistId,
        });
        setWordlist(innerWordlist); // Set the fetched wordlist

        let currIndex;
        let ord;

        let wordlistExistenceIndex = -1;

        if (userData.wordlistsStudyDepth) {
          userData.wordlistsStudyDepth.forEach((element, index) => {
            if (element.wordlistId === wordlistId) {
              wordlistExistenceIndex = index; // Find the index of the wordlist in user's data
            }
          });
        }

        if (wordlistExistenceIndex !== -1) {
          currIndex =
            userData.wordlistsStudyDepth[wordlistExistenceIndex].currentIndex; // Get the current index from user's data
          ord = userData.wordlistsStudyDepth[wordlistExistenceIndex].order; // Get the order from user's data
          if (currIndex === ord.length - 1) {
            currIndex = 0; // Reset index if it is the last word
          }
          setCurrentIndex(currIndex); // Set current index
          setOrder(ord); // Set order
        } else {
          currIndex = 0; // Initialize current index
          ord = randomizeArrayIndex(innerWordlist.words); // Randomize order
          setCurrentIndex(currIndex); // Set current index
          setOrder(ord); // Set order
          setUserData(
            await uploadWordlistPractice({
              orderUpload: ord,
              currentIndexUpload: currIndex,
            })
          );
        }

        const wordId = innerWordlist.words[ord[currIndex]]; // Get the word ID for the current index
        const word = await getWord({ wordId }); // Fetch the word

        setCurrentWord(word); // Set the current word
      } catch (err) {
        console.error("Error fetching wordlist", err);
        setError("Failed to fetch wordlist. Please try again.");
      }
    };
    fetchWordlist(); // Fetch the wordlist on component mount
  }, []);

  useEffect(() => {
    if (
      !currentWord?.audioId &&
      currentWord &&
      currentIndex !== wordlist.words.length - 1
    ) {
      nextWord(); // Fetch the next word if the current word has no audio
    }
  }, [currentWord]);

  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-yellow-800 mb-6 text-center">
        Wordlist Practice
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {currentWord && currentWord.audioId && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <audio controls autoPlay className="w-full mb-4">
            <source
              src={`http://localhost:8080/api/audio/${currentWord.audioId}`}
              type="audio/wav"
            />
          </audio>
          <p className="text-lg text-yellow-700 mb-2">
            <strong>Definition:</strong> {currentWord.definition}
          </p>
          <p className="text-lg text-yellow-700 mb-2">
            <strong>Part of Speech:</strong> {currentWord.partOfSpeech}
          </p>
          <p className="text-lg text-yellow-700 mb-2">
            <strong>Etymology:</strong> {currentWord.etymology}
          </p>

          <p className="text-lg text-yellow-700 mb-4">
            <strong>Notes:</strong> {currentWord.notes || "None"}
          </p>
          <input
            autoComplete="off"
            type="text"
            value={usersGuess}
            autoFocus
            onChange={(e) => {
              setUsersGuess(e.target.value);
              setIsIncorrect(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkWord();
              }
            }}
            className="w-full p-2 border border-yellow-300 rounded mb-4"
            placeholder="Enter your spelling"
          />
          {isIncorrect && (
            <p className="text-red-500 mb-4">Incorrect, please try again.</p>
          )}
          <button
            onClick={checkWord}
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default WordlistPractice;
