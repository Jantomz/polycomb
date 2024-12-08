import { useEffect, useState, useRef } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const AdminEditWordlist = ({ user, userData }) => {
  const { getWordlist, getWord, uploadAudio, deleteWord, deleteWordlist } =
    useApi();
  const { code, wordlistId } = useParams();
  const [wordlist, setWordlist] = useState([]);
  const [words, setWords] = useState([]);
  const [isRecording, setIsRecording] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 20;
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    const performInitialRender = async () => {
      const resWordlist = await getWordlist({
        competitionCode: code,
        wordlistId,
      });
      setWordlist(resWordlist);
      setTotalPages(Math.ceil(resWordlist.words.length / pageSize));
    };
    performInitialRender();
  }, [userData]);

  useEffect(() => {
    fetchWords(1);
  }, [wordlist]);

  const fetchWords = async (page) => {
    if (!wordlist.words) return;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const wordIds = wordlist.words.slice(start, end);
    const words = await Promise.all(
      wordIds.map((id) => getWord({ wordId: id }))
    );
    setWords(words);
    setCurrentPage(page);
    console.log(words);
  };

  const postAudio = async ({ wordId, audio }) => {
    const word = await getWord({ wordId });
    const newWord = await uploadAudio({
      audio,
      wordId,
      creatorId: user.uid,
      oldAudioId: word.audioId,
    });
    setWords((prevWords) =>
      prevWords.map((prevWord) =>
        prevWord._id === wordId ? newWord : prevWord
      )
    );

    console.log(newWord);

    fetchWords(currentPage);
  };

  const startRecording = async ({ wordId }) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      const audioBlob = event.data;
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      const setAudio = async () => {
        await postAudio({ wordId, audio: audioFile });
      };
      setAudio();
    };
    mediaRecorderRef.current.start();
    setIsRecording(wordId);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording("");
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-700 mb-4">Edit Wordlist</h1>
      <button
        onClick={() => {
          const removeWordlist = async () => {
            await deleteWordlist({ wordlistId });
            navigate(`/competition/${code}`);
          };
          removeWordlist();
        }}
        className="w-full p-2 mb-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Wordlist
      </button>
      {wordlist && (
        <>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
            {wordlist.title}
          </h2>
          <p className="text-yellow-700 mb-4">{wordlist.description}</p>
          {words.map(
            (word) =>
              word._id && (
                <div
                  key={word._id}
                  className="border border-yellow-300 p-4 mb-4 rounded-lg bg-white shadow-md"
                >
                  <h3 className="text-xl font-bold text-yellow-800">
                    {word.word}
                  </h3>
                  {word.audioId && (
                    <audio controls className="mt-2 mx-auto">
                      <source
                        src={`http://localhost:8080/api/audio/${word.audioId}`}
                        type="audio/mpeg"
                      />
                    </audio>
                  )}
                  <p className="text-yellow-700">{word.pronunciation}</p>
                  <p className="text-yellow-700">{word.partOfSpeech}</p>
                  <p className="text-yellow-700">{word.definition}</p>
                  <p className="text-yellow-700">{word.etymology}</p>
                  <p className="text-yellow-700">{word.sentence}</p>
                  <p className="text-yellow-700">{word.notes}</p>
                  {isRecording === word._id ? (
                    <button
                      onClick={stopRecording}
                      className="w-full p-2 mb-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Stop Recording
                    </button>
                  ) : (
                    <button
                      onClick={() => startRecording({ wordId: word._id })}
                      className="w-full p-2 mb-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Start Recording
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const removeWord = async () => {
                        await deleteWord({
                          wordId: word._id,
                          audioId: word.audioId || null,
                        });
                        await fetchWords(currentPage);
                      };
                      removeWord();
                    }}
                    className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )
          )}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchWords(page)}
                disabled={page === currentPage}
                className={`px-4 py-2 mx-1 rounded ${
                  page === currentPage
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEditWordlist;
