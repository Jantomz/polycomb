import useApi from "../../hooks/useApi.js"; // Custom hook to interact with API
import useCSV from "../../hooks/useCSV.js"; // Custom hook to handle CSV operations
import { useState } from "react"; // React hook for state management

const WordlistDifficulty = () => {
  const { getWords } = useCSV(); // Destructure getWords function from useCSV hook
  const { generateWordFrequency } = useApi(); // Destructure generateWordFrequency function from useApi hook

  const [words, setWords] = useState([]); // State to store words from CSV
  const [file, setFile] = useState(null); // State to store the selected file
  const [error, setError] = useState(null); // State to store any errors

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state when a file is selected
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const words = await getWords(file); // Get words from the CSV file
        setWords(words); // Update words state with the retrieved words
        const frequencies = await Promise.all(
          words.map(async (word) => {
            try {
              const frequency = await generateWordFrequency({
                word: word.word,
              }); // Generate frequency for each word
              const freq = frequency.frequency; // Extract frequency value
              return { ...word, freq }; // Add frequency to the word object
            } catch (err) {
              console.error(
                `Error generating frequency for word ${word.word}:`,
                err
              );
              return { ...word, freq: "Error" }; // Handle error and set frequency to "Error"
            }
          })
        );
        setWords(frequencies); // Update words state with frequencies
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload and process the file. Please try again."); // Set error message
      }
    } else {
      setError("Please select a file to upload."); // Set error message if no file is selected
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <div className="border-2 border-yellow-300 p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700 text-center">
          Wordlist Difficulty Calc
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            className="border-2 border-yellow-300 p-2 rounded-lg mb-4 md:mb-0 w-full md:w-1/2"
            type="file"
            accept=".csv"
            onChange={handleFileChange} // Handle file selection
          />
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 w-full md:w-auto"
            onClick={handleUpload} // Handle file upload
          >
            Upload CSV
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {words.length > 0 && (
          <div className="w-full h-80 overflow-y-auto mt-4">
            <h3 className="text-xl font-semibold mb-2 text-center">Preview</h3>
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
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 mt-4 w-full md:w-auto"
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
                ].join(","); // Create CSV header

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
                    .join("\n"); // Create CSV content

                const encodedUri = encodeURI(csvContent); // Encode CSV content
                const link = document.createElement("a"); // Create a download link
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "wordlist.csv"); // Set download attribute
                document.body.appendChild(link); // Append link to the body
                link.click(); // Trigger download
                document.body.removeChild(link); // Remove link after download
              } catch (err) {
                console.error("Error downloading CSV:", err);
                setError("Failed to download the CSV file. Please try again."); // Set error message
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
