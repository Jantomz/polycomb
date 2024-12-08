import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";

const ViewWordlist = ({ user, userData }) => {
  const { getWordlist, getWord } = useApi();
  const code = useParams().code;
  const wordlistId = useParams().wordlistId;
  const [wordlist, setWordlist] = useState([]);
  const [words, setWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 20;

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
    console.log("WORDLIST", wordlist);
    const wordIds = wordlist.words.slice(start, end);
    const words = await Promise.all(
      wordIds.map((id) => getWord({ wordId: id }))
    );
    setWords(words);
    setCurrentPage(page);
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
      {wordlist && (
        <>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
            {wordlist.title}
          </h2>
          <p className="text-yellow-700 mb-4">{wordlist.description}</p>
          {words.map((word) => (
            <div
              key={word._id}
              className="border border-yellow-300 p-4 mb-4 rounded-lg bg-white shadow-md"
            >
              <h3 className="text-xl font-bold text-yellow-800">{word.word}</h3>
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
            </div>
          ))}
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

export default ViewWordlist;
