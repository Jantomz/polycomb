import { useEffect, useState } from "react"; // Importing necessary hooks from React
import { useParams } from "react-router-dom"; // Importing useParams to get URL parameters
import useApi from "../hooks/useApi.js"; // Importing custom hook for API calls

const ViewCompetitionFiles = () => {
  const [files, setFiles] = useState([]); // State to store files
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error messages

  const { code } = useParams(); // Extracting competition code from URL parameters
  const { getFiles } = useApi(); // Destructuring getFiles function from custom hook

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getFiles({ competitionCode: code }); // Fetching files using competition code
        setFiles(files); // Updating state with fetched files
      } catch (err) {
        setError("Failed to fetch files. Please try again later."); // Setting error message if fetch fails
      } finally {
        setLoading(false); // Setting loading to false after fetch attempt
      }
    };
    fetchFiles(); // Calling the fetchFiles function
  }, []); // Dependency array to re-run effect if code or getFiles changes

  if (loading) {
    return <p>Loading...</p>; // Display loading message while fetching files
  }

  if (error) {
    return <p>{error}</p>; // Display error message if there is an error
  }

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-2">Files</h3>
      {files.length > 0 ? (
        files.map((file) => (
          <div
            key={file.id} // Unique key for each file
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
        <p>Nothing here!</p> // Message when no files are available
      )}
    </section>
  );
};

export default ViewCompetitionFiles; // Exporting the component as default
