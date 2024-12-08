import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useRef } from "react";

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
    <div>
      <h1>Edit Wordlist</h1>
      <Link to={`/competition/${code}/wordlist/${wordlistId}/practice`}>
        Practice
      </Link>
      {wordlist && (
        <>
          <h2>{wordlist.title}</h2>
          <p>{wordlist.description}</p>
          {words.map((word) => (
            <div
              key={word._id}
              style={{
                border: "1px solid black",
              }}
            >
              <h3>{word.word}</h3>
              <p>{word.pronunciation}</p>
              <p>{word.partOfSpeech}</p>
              <p>{word.definition}</p>
              <p>{word.sentence}</p>
              <p>{word.notes}</p>

              {word.audioId && (
                <audio controls>
                  <source
                    src={`http://localhost:8080/api/audio/${word.audioId}`}
                    type="audio/mpeg"
                  />
                </audio>
              )}
            </div>
          ))}
          <div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchWords(page)}
                disabled={page === currentPage}
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
