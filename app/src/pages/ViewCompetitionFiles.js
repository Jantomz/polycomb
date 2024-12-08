import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi.js";

const ViewCompetitionFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { code } = useParams();
  const { getFiles } = useApi();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getFiles({ competitionCode: code });
        setFiles(files);
      } catch (err) {
        setError("Failed to fetch files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-2">Files</h3>
      {files.length > 0 ? (
        files.map((file) => (
          <div
            key={file.id}
            className="mb-4 p-4 bg-yellow-100 rounded flex justify-between items-center"
          >
            <a
              href={`http://localhost:8080/api/file/${file.fileId}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {file.filename}
            </a>
          </div>
        ))
      ) : (
        <p>Nothing here!</p>
      )}
    </section>
  );
};

export default ViewCompetitionFiles;
