import { useEffect, useState } from "react"; // Importing hooks from React
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls
import { Link, useParams } from "react-router-dom"; // Importing routing components
import React from "react";

const ViewWordlist = ({ user, userData }) => {
  const { getWordlist, getWord } = useApi(); // Destructuring API functions from custom hook
  const { code, wordlistId } = useParams(); // Extracting URL parameters
  const [wordlist, setWordlist] = useState([]); // State to store wordlist data
  const [words, setWords] = useState([]); // State to store words data
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages
  const [error, setError] = useState(null); // State to handle errors
  const pageSize = 20; // Number of words per page

  useEffect(() => {
    const performInitialRender = async () => {
      try {
        const resWordlist = await getWordlist({
          competitionCode: code,
          wordlistId,
        }); // Fetching wordlist data
        setWordlist(resWordlist); // Setting wordlist state
        setTotalPages(Math.ceil(resWordlist.words.length / pageSize)); // Calculating total pages
      } catch (err) {
        setError("Failed to fetch wordlist. Please try again later."); // Setting error message
        console.error(err); // Logging error to console
      }
    };
    performInitialRender(); // Initial render call
  }, [userData]); // Dependency array for useEffect

  useEffect(() => {
    if (wordlist.words) {
      fetchWords(1); // Fetching words for the first page
    }
  }, [wordlist]); // Dependency array for useEffect

  const fetchWords = async (page) => {
    if (!wordlist.words) return; // Return if no words in wordlist
    const start = (page - 1) * pageSize; // Calculate start index
    const end = start + pageSize; // Calculate end index
    const wordIds = wordlist.words.slice(start, end); // Slice word IDs for current page
    try {
      const words = await Promise.all(
        wordIds.map((id) => getWord({ wordId: id }))
      ); // Fetching words data
      setWords(words); // Setting words state
      setCurrentPage(page); // Updating current page state
    } catch (err) {
      setError("Failed to fetch words. Please try again later."); // Setting error message
      console.error(err); // Logging error to console
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-700 mb-4">Edit Wordlist</h1>
      <Link
        to={`/competition/${code}/wordlist/${wordlistId}/practice`}
        className="text-yellow-600 hover:text-yellow-800 underline mb-4 inline-block"
      >
        Practice
      </Link>
      {error && <div className="text-red-600 mb-4">{error}</div>}{" "}
      {/* Display error message if any */}
      {wordlist && (
        <>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
            {wordlist.title} {/* Display wordlist title */}
          </h2>
          <p className="text-yellow-700 mb-4">{wordlist.description}</p>{" "}
          {/* Display wordlist description */}
          {words.map((word) => (
            <div
              key={word._id}
              className="border border-yellow-300 p-4 mb-4 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-xl font-bold text-yellow-800">{word.word}</h3>{" "}
              {/* Display word */}
              {word.audioId && (
                <audio controls className="mt-2 mx-auto w-full sm:w-auto">
                  <source
                    src={`http://localhost:8080/api/audio/${word.audioId}`}
                    type="audio/mpeg"
                  />{" "}
                  {/* Audio source for word pronunciation */}
                </audio>
              )}
              <p className="text-yellow-700">{word.pronunciation}</p>{" "}
              {/* Display word pronunciation */}
              <p className="text-yellow-700">{word.partOfSpeech}</p>{" "}
              {/* Display part of speech */}
              <p className="text-yellow-700">{word.definition}</p>{" "}
              {/* Display word definition */}
              <p className="text-yellow-700">{word.etymology}</p>{" "}
              {/* Display word etymology */}
              <p className="text-yellow-700">{word.sentence}</p>{" "}
              {/* Display example sentence */}
              <p className="text-yellow-700">{word.notes}</p>{" "}
              {/* Display additional notes */}
            </div>
          ))}
          <div className="flex justify-center mt-4 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchWords(page)} // Fetch words for selected page
                disabled={page === currentPage} // Disable button for current page
                className={`px-4 py-2 mx-1 my-1 rounded ${
                  page === currentPage
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                }`}
              >
                {page} {/* Display page number */}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewWordlist;
