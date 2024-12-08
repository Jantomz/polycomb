import { useEffect, useState, useRef } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const AdminEditWordlist = ({ user, userData }) => {
  const { getWordlist, getWord, uploadAudio, deleteWord, deleteWordlist } =
    useApi(); // Destructure API functions from custom hook
  const { code, wordlistId } = useParams(); // Get URL parameters
  const [wordlist, setWordlist] = useState([]); // State to store wordlist data
  const [words, setWords] = useState([]); // State to store words data
  const [isRecording, setIsRecording] = useState(""); // State to track recording status
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages
  const [error, setError] = useState(null); // State to track errors
  const navigate = useNavigate(); // Hook to navigate programmatically
  const pageSize = 20; // Number of words per page
  const mediaRecorderRef = useRef(null); // Ref to store MediaRecorder instance

  useEffect(() => {
    const performInitialRender = async () => {
      try {
        const resWordlist = await getWordlist({
          competitionCode: code,
          wordlistId,
        }); // Fetch wordlist data
        setWordlist(resWordlist); // Set wordlist state
        setTotalPages(Math.ceil(resWordlist.words.length / pageSize)); // Calculate total pages
      } catch (err) {
        setError("Failed to fetch wordlist."); // Set error message
        console.error(err); // Log error
      }
    };
    performInitialRender(); // Call the async function
  }, [userData]); // Dependency array

  useEffect(() => {
    fetchWords(1); // Fetch words for the first page
  }, [wordlist]); // Dependency array

  const fetchWords = async (page) => {
    if (!wordlist.words) return; // Return if no words in wordlist
    const start = (page - 1) * pageSize; // Calculate start index
    const end = start + pageSize; // Calculate end index
    const wordIds = wordlist.words.slice(start, end); // Get word IDs for the current page
    try {
      const words = await Promise.all(
        wordIds.map((id) => getWord({ wordId: id }))
      ); // Fetch words data
      setWords(words); // Set words state
      setCurrentPage(page); // Set current page
    } catch (err) {
      setError("Failed to fetch words."); // Set error message
      console.error(err); // Log error
    }
  };

  const postAudio = async ({ wordId, audio }) => {
    try {
      const word = await getWord({ wordId }); // Fetch word data
      const newWord = await uploadAudio({
        audio,
        wordId,
        creatorId: user.uid,
        oldAudioId: word.audioId,
      }); // Upload new audio
      setWords((prevWords) =>
        prevWords.map((prevWord) =>
          prevWord._id === wordId ? newWord : prevWord
        )
      ); // Update words state
      fetchWords(currentPage); // Refresh words for the current page
    } catch (err) {
      setError("Failed to upload audio."); // Set error message
      console.error(err); // Log error
    }
  };

  const startRecording = async ({ wordId }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Get audio stream
      mediaRecorderRef.current = new MediaRecorder(stream); // Create MediaRecorder instance
      mediaRecorderRef.current.ondataavailable = (event) => {
        const audioBlob = event.data; // Get audio data
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        }); // Create audio file

        const setAudio = async () => {
          await postAudio({ wordId, audio: audioFile }); // Upload audio
        };
        setAudio(); // Call the async function
      };
      mediaRecorderRef.current.start(); // Start recording
      setIsRecording(wordId); // Set recording status
    } catch (err) {
      setError("Failed to start recording."); // Set error message
      console.error(err); // Log error
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop recording
      setIsRecording(""); // Reset recording status
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-700 mb-4">Edit Wordlist</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
      {/* Display error message */}
      <button
        onClick={() => {
          const removeWordlist = async () => {
            try {
              await deleteWordlist({ wordlistId }); // Delete wordlist
              navigate(`/competition/${code}`); // Navigate to competition page
            } catch (err) {
              setError("Failed to delete wordlist."); // Set error message
              console.error(err); // Log error
            }
          };
          removeWordlist(); // Call the async function
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
                        try {
                          await deleteWord({
                            wordId: word._id,
                            audioId: word.audioId || null,
                          }); // Delete word
                          await fetchWords(currentPage); // Refresh words for the current page
                        } catch (err) {
                          setError("Failed to delete word."); // Set error message
                          console.error(err); // Log error
                        }
                      };
                      removeWord(); // Call the async function
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
                onClick={() => fetchWords(page)} // Fetch words for the selected page
                disabled={page === currentPage} // Disable button for the current page
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
