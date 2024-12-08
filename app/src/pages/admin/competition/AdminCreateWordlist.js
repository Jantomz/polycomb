import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import useCSV from "../../../hooks/useCSV.js";
import { useState } from "react";

const AdminCreateWordlist = ({ user }) => {
  const competitionCode = useParams().code;
  const { createWordlist } = useApi();
  const { getWords } = useCSV();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [words, setWords] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setError(null);
        console.log(file);
        const words = await getWords(file);
        console.log(words);
        setWords(words);
      } catch (err) {
        console.error("Error uploading file:", err);
        if (err.response && err.response.data) {
          setError(`Failed to upload file: ${err.response.data.message}`);
        } else {
          setError("Failed to upload file. Please try again.");
        }
      }
    } else {
      setError("Please select a file to upload.");
    }
  };

  const handleCreateWordlist = async () => {
    console.log(
      "Creating wordlist",
      title,
      description,
      competitionCode,
      words
    );

    setLoading(true);
    setError(null);

    try {
      const wordlist = await createWordlist({
        title,
        description,
        competitionCode,
        creatorId: user.uid,
        words,
      });

      navigate(`/competition/${competitionCode}/wordlist/${wordlist._id}`);
      console.log(wordlist);
    } catch (err) {
      console.error("Error creating wordlist:", err);
      if (err.response && err.response.data) {
        setError(`Failed to create wordlist: ${err.response.data.message}`);
      } else {
        setError("Failed to create wordlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-yellow-100 min-h-screen">
      <div className="mb-4">
        <input
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          placeholder="Title"
          autoComplete="off"
        />
        <input
          type="text"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          placeholder="Description"
          autoComplete="off"
        />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          autoComplete="off"
        />
        <button
          onClick={handleUpload}
          className="w-full p-2 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Upload CSV
        </button>
        <button
          onClick={handleCreateWordlist}
          className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Create Wordlist
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      {words.length > 0 && (
        <div className="mt-4">
          {words.map((word, index) => (
            <div key={index} className="p-4 mb-2 bg-yellow-200 rounded">
              <h3 className="text-lg font-bold">{word.word}</h3>
              <p>{word.pronunciation}</p>
              <p>{word.partOfSpeech}</p>
              <p>{word.definition}</p>
              <p>{word.etymology}</p>
              <p>{word.sentence}</p>
              <p>{word.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCreateWordlist;
