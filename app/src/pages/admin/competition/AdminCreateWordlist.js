import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import useCSV from "../../../hooks/useCSV.js";
import { useState } from "react";

const AdminCreateWordlist = ({ user }) => {
  const competitionCode = useParams().code;
  const { createWordlist } = useApi();
  const { getWords } = useCSV();

  const [words, setWords] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

    const wordlist = await createWordlist({
      title,
      description,
      competitionCode,
      creatorId: user.uid,
      words,
    });
    console.log(wordlist);
  };

  return (
    <div>
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      <button onClick={handleCreateWordlist}>Create Wordlist</button>

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
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminCreateWordlist;
