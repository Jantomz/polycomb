import useApi from "../../hooks/useApi.js";
import useCSV from "../../hooks/useCSV.js";
import { useState } from "react";

const WordlistDifficulty = () => {
  const { getWords } = useCSV();
  const { generateWordFrequency } = useApi();

  const [words, setWords] = useState([]);

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      console.log(file);
      const words = await getWords(file);
      console.log(words);
      setWords(words);
      const frequencies = await Promise.all(
        words.map(async (word) => {
          const frequency = await generateWordFrequency({ word: word.word });
          const freq = frequency.frequency;
          return { ...word, freq };
        })
      );

      setWords(frequencies);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>

      {words.length > 0 && (
        <>
          {words.map((word, index) => (
            <div key={index}>
              <h3>{word.word}</h3>
              <p>{word.pronunciation}</p>
              <p>{word.partOfSpeech}</p>
              <p>{word.definition}</p>
              <p>{word.etymology}</p>
              <p>{word.sentence}</p>
              <p>{word.notes}</p>
              {word.freq && <p>{word.freq}</p>}
            </div>
          ))}
        </>
      )}
      <button
        onClick={() => {
          const csvHeader = [
            "Word",
            "Pronunciation",
            "Part of Speech",
            "Definition",
            "Etymology",
            "Sentence",
            "Notes",
            "Frequency",
          ].join(",");

          const csvContent =
            "data:text/csv;charset=utf-8," +
            csvHeader +
            "\n" +
            words
              .map((word) =>
                [
                  `"${word.word}"`,
                  `"${word.pronunciation}"`,
                  `"${word.partOfSpeech}"`,
                  `"${word.definition}"`,
                  `"${word.etymology}"`,
                  `"${word.sentence}"`,
                  `"${word.notes}"`,
                  `"${word.freq}"`,
                ].join(",")
              )
              .join("\n");

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "wordlist.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Download as CSV
      </button>
    </div>
  );
};

export default WordlistDifficulty;
