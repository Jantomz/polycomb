import { useNavigate, useParams } from "react-router-dom"; // Import hooks for navigation and URL parameters
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls
import useCSV from "../../../hooks/useCSV.js"; // Custom hook for handling CSV files
import { useState } from "react"; // Import useState hook for managing component state

const AdminCreateWordlist = ({ user }) => {
  const competitionCode = useParams().code; // Get competition code from URL parameters
  const { createWordlist } = useApi(); // Destructure createWordlist function from useApi hook
  const { getWords } = useCSV(); // Destructure getWords function from useCSV hook

  const navigate = useNavigate(); // Initialize navigate function for programmatic navigation

  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages

  const [words, setWords] = useState([]); // State to store words from the uploaded CSV file

  const [title, setTitle] = useState(""); // State to store the title of the wordlist
  const [description, setDescription] = useState(""); // State to store the description of the wordlist

  const [file, setFile] = useState(null); // State to store the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state when a new file is selected
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setError(null); // Clear any previous errors
        const words = await getWords(file); // Get words from the CSV file
        setWords(words); // Update words state with the parsed words
      } catch (err) {
        console.error("Error uploading file:", err); // Log error to console
        if (err.response && err.response.data) {
          setError(`Failed to upload file: ${err.response.data.message}`); // Set error message from response
        } else {
          setError("Failed to upload file. Please try again."); // Set generic error message
        }
      }
    } else {
      setError("Please select a file to upload."); // Set error if no file is selected
    }
  };

  const handleCreateWordlist = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    if (!title) {
      setError("Please enter a title for the wordlist."); // Set error if title is missing
      setLoading(false); // Reset loading state
      return;
    }

    if (!description) {
      setError("Please enter a description for the wordlist."); // Set error if description is missing
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const wordlist = await createWordlist({
        title,
        description,
        competitionCode,
        creatorId: user.uid, // Include user ID as creatorId
        words,
      });

      navigate(`/competition/${competitionCode}/wordlist/${wordlist._id}`); // Navigate to the newly created wordlist
    } catch (err) {
      console.error("Error creating wordlist:", err); // Log error to console
      if (err.response && err.response.data) {
        setError(`Failed to create wordlist: ${err.response.data.message}`); // Set error message from response
      } else {
        setError("Failed to create wordlist. Please try again."); // Set generic error message
      }
    } finally {
      setLoading(false); // Reset loading state
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
          onChange={(e) => setTitle(e.target.value)} // Update title state on change
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          placeholder="Title"
          autoComplete="off"
          disabled={loading} // Disable input if loading
        />
        <input
          type="text"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description state on change
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          placeholder="Description"
          autoComplete="off"
          disabled={loading} // Disable input if loading
        />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange} // Handle file selection
          className="w-full p-2 mb-2 border border-yellow-500 rounded"
          autoComplete="off"
          disabled={loading} // Disable input if loading
        />
        <button
          onClick={handleUpload} // Handle CSV upload
          className="w-full p-2 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={loading} // Disable button if loading
        >
          Upload CSV
        </button>
        <button
          onClick={handleCreateWordlist} // Handle wordlist creation
          className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={loading} // Disable button if loading
        >
          Create Wordlist
        </button>
      </div>

      {loading && (
        <div className="p-4 mb-4 bg-blue-200 text-blue-800 rounded">
          Loading... {/* Display loading message */}
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-200 text-red-800 rounded">{error}</div> // Display error message
      )}

      {words.length > 0 && (
        <div className="mt-4">
          {words.map((word, index) => (
            <div key={index} className="p-4 mb-2 bg-yellow-200 rounded">
              <h3 className="text-lg font-bold">{word.word}</h3>{" "}
              {/* Display word */}
              <p>{word.pronunciation}</p> {/* Display pronunciation */}
              <p>{word.partOfSpeech}</p> {/* Display part of speech */}
              <p>{word.definition}</p> {/* Display definition */}
              <p>{word.etymology}</p> {/* Display etymology */}
              <p>{word.sentence}</p> {/* Display sentence */}
              <p>{word.notes}</p> {/* Display notes */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCreateWordlist; // Export component
