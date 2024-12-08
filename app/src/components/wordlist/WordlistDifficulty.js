import useApi from "../../hooks/useApi.js";
import useCSV from "../../hooks/useCSV.js";
import { useState } from "react";

const WordlistDifficulty = () => {
  const { getWords } = useCSV();
  const { generateWordFrequency } = useApi();

  const [words, setWords] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        console.log(file);
        const words = await getWords(file);
        console.log(words);
        setWords(words);
        const frequencies = await Promise.all(
          words.map(async (word) => {
            try {
              const frequency = await generateWordFrequency({
                word: word.word,
              });
              const freq = frequency.frequency;
              return { ...word, freq };
            } catch (err) {
              console.error(
                `Error generating frequency for word ${word.word}:`,
                err
              );
              return { ...word, freq: "Error" };
            }
          })
        );
        setWords(frequencies);
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload and process the file. Please try again.");
      }
    } else {
      setError("Please select a file to upload.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-max">
      <div className="border-2 border-yellow-300 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700">
          Wordlist Difficulty Calculator
        </h1>
        <div className="flex gap-4 justify-center">
          <input
            className="border-2 border-yellow-300 p-2 rounded-lg mb-4 w-1/4"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 mb-4"
            onClick={handleUpload}
          >
            Upload CSV
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {words.length > 0 && (
          <div className="w-1/2 h-80 overflow-y-auto mx-auto">
            <h3 className="text-xl font-semibold mb-2">Preview</h3>
            {words.map((word, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">{word.word}</h3>
                <p className="text-sm">Pronunciation: {word.pronunciation}</p>
                <p className="text-sm">Part of speech: {word.partOfSpeech}</p>
                <p className="text-sm">Definition: {word.definition}</p>
                <p className="text-sm">Etymology: {word.etymology}</p>
                <p className="text-sm">Sentence: {word.sentence}</p>
                <p className="text-sm">Notes: {word.notes}</p>
                {word.freq && (
                  <p className="text-sm font-bold">
                    Generated Frequency: {word.freq}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {words[words.length - 1]?.freq && (
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
            onClick={() => {
              try {
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
              } catch (err) {
                console.error("Error downloading CSV:", err);
                setError("Failed to download the CSV file. Please try again.");
              }
            }}
          >
            Download as CSV
          </button>
        )}
      </div>
    </div>
  );
};

export default WordlistDifficulty;
