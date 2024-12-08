import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useEffect, useState } from "react";

const WordlistPractice = ({ user, userData, setUserData }) => {
  const competitionCode = useParams().code;
  const wordlistId = useParams().wordlistId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [order, setOrder] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [wordlist, setWordlist] = useState(null);
  const [usersGuess, setUsersGuess] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { getWordlist, setWordlistPractice, getWord } = useApi();

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
    const indexArray = arr.map((_, index) => index);

    for (let i = indexArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
    }

    return indexArray;
  };

  const nextWord = async () => {
    setLoading(true);
    try {
      if (currentIndex === order.length - 1) {
        let currO = randomizeArrayIndex(wordlist.words);
        setCurrentIndex(0);
        setOrder(currO);
        setUserData(
          await uploadWordlistPractice({
            orderUpload: currO,
            currentIndexUpload: 0,
          })
        );
        alert("End of wordlist");
        navigate(`/competition/${competitionCode}/wordlist/${wordlistId}`);
      } else {
        setCurrentIndex(currentIndex + 1);
        setUserData(
          await uploadWordlistPractice({
            orderUpload: order,
            currentIndexUpload: currentIndex + 1,
          })
        );
      }

      const wordId = wordlist.words[order[currentIndex + 1]];

      const word = await getWord({ wordId });

      setCurrentWord(word);

      setUsersGuess("");
      setIsIncorrect(false);
    } catch (err) {
      console.error("Error fetching next word", err);
      setError("Failed to fetch the next word. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkWord = () => {
    if (usersGuess === currentWord.word) {
      nextWord();
    } else {
      setIsIncorrect(true);
    }
  };

  useEffect(() => {
    const fetchWordlist = async () => {
      try {
        const innerWordlist = await getWordlist({
          competitionCode,
          wordlistId,
        });
        setWordlist(innerWordlist);

        let currIndex;
        let ord;

        let wordlistExistenceIndex = -1;

        if (userData.wordlistsStudyDepth) {
          userData.wordlistsStudyDepth.forEach((element, index) => {
            if (element.wordlistId === wordlistId) {
              wordlistExistenceIndex = index;
            }
          });
        }

        if (wordlistExistenceIndex !== -1) {
          currIndex =
            userData.wordlistsStudyDepth[wordlistExistenceIndex].currentIndex;
          ord = userData.wordlistsStudyDepth[wordlistExistenceIndex].order;
          if (currIndex === ord.length - 1) {
            currIndex = 0;
          }
          setCurrentIndex(currIndex);
          setOrder(ord);
        } else {
          currIndex = 0;
          ord = randomizeArrayIndex(innerWordlist.words);
          setCurrentIndex(currIndex);
          setOrder(ord);
          setUserData(
            await uploadWordlistPractice({
              orderUpload: ord,
              currentIndexUpload: currIndex,
            })
          );
        }

        const wordId = innerWordlist.words[ord[currIndex]];
        const word = await getWord({ wordId });

        setCurrentWord(word);
      } catch (err) {
        console.error("Error fetching wordlist", err);
        setError("Failed to fetch wordlist. Please try again.");
      }
    };
    fetchWordlist();
  }, []);

  useEffect(() => {
    if (
      !currentWord?.audioId &&
      currentWord &&
      currentIndex !== wordlist.words.length - 1
    ) {
      nextWord();
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
