import { useParams } from "react-router-dom";
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

  const { getWordlist, setWordlistPractice, getWord } = useApi();

  const uploadWordlistPractice = async ({
    orderUpload,
    currentIndexUpload,
  }) => {
    const res = await setWordlistPractice({
      wordlistId,
      userId: user.uid,
      order: orderUpload,
      currentIndex: currentIndexUpload,
    });
    console.log("Uploaded wordlist practice", res);
  };

  const randomizeArrayIndex = (arr) => {
    const indexArray = arr.map((_, index) => index);

    for (let i = indexArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
    }

    console.log("IndexArray", indexArray);

    return indexArray;
  };

  const nextWord = async () => {
    if (currentIndex === order.length - 1) {
      console.log("End of wordlist");
    } else {
      setCurrentIndex(currentIndex + 1);
      setUserData(
        uploadWordlistPractice({
          orderUpload: order,
          currentIndexUpload: currentIndex + 1,
        })
      );
    }

    const wordId = wordlist.words[order[currentIndex + 1]];

    const word = await getWord({ wordId });

    setCurrentWord(word);

    console.log("Next word", word);

    setUsersGuess("");

    return word;
  };

  const checkWord = () => {
    console.log("Checking word", usersGuess, currentWord.word);

    if (usersGuess === currentWord.word) {
      console.log("Correct");
      nextWord();
    } else {
      console.log("Incorrect");
    }
  };

  useEffect(() => {
    let innerWordlist;
    const fetchWordlist = async () => {
      innerWordlist = await getWordlist({
        competitionCode,
        wordlistId,
      });
      console.log("Inner", innerWordlist);
      setWordlist(innerWordlist);

      let currIndex;
      let ord;

      let wordlistExistenceIndex = -1;

      console.log("userData", userData);

      userData.wordlistsStudyDepth.forEach((element, index) => {
        if (element.wordlistId === wordlistId) {
          wordlistExistenceIndex = index;
        }
      });

      if (wordlistExistenceIndex !== -1) {
        currIndex =
          userData.wordlistsStudyDepth[wordlistExistenceIndex].currentIndex;
        ord = userData.wordlistsStudyDepth[wordlistExistenceIndex].order;
        if (currIndex === ord.length - 1) {
          currIndex = 0;
        }
        setCurrentIndex(currIndex);
        setOrder(ord);
        console.log("Grabbing from userData", currIndex, ord);
      } else {
        currIndex = 0;
        ord = randomizeArrayIndex(innerWordlist.words);
        setCurrentIndex(currIndex);
        setOrder(ord);
        setUserData(
          uploadWordlistPractice({
            orderUpload: ord,
            currentIndexUpload: currIndex,
          })
        );
      }

      const getWordFromId = async (wordId) => {
        const word = await getWord({ wordId });
        return word;
      };

      const wordId = innerWordlist.words[ord[currIndex]];
      console.log("WordId", wordId);
      const word = await getWordFromId(wordId);

      if (!word.audioId) {
        console.log("No audio");
      }

      setCurrentWord(word);
    };
    fetchWordlist();
  }, []);

  useEffect(() => {
    if (
      !currentWord?.audioId &&
      currentWord &&
      currentIndex !== wordlist.words.length - 1
    ) {
      console.log("No audio");
      nextWord();
    }
  }, [currentWord]);

  return (
    <div>
      <h1>WordlistPractice</h1>
      {currentWord && currentWord.audioId && (
        <>
          <audio controls>
            <source
              src={`http://localhost:8080/api/audio/${currentWord.audioId}`}
              type="audio/wav"
            />
          </audio>
          <p>{currentWord.definition}</p>
          <p>{currentWord.partOfSpeech}</p>
          <p>{currentWord.etymology}</p>
          <p>{currentWord.sentence}</p>
          <p>{currentWord.notes}</p>
          <input
            type="text"
            value={usersGuess}
            onChange={(e) => setUsersGuess(e.target.value)}
          />
          <button onClick={checkWord}>Submit</button>
        </>
      )}
    </div>
  );
};

export default WordlistPractice;
