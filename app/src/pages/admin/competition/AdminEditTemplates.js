import { useEffect, useState } from "react"; // Importing hooks from React
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks from react-router-dom for routing
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls

const AdminEditTemplates = () => {
  const [templates, setTemplates] = useState([]); // State to store templates
  const [error, setError] = useState(null); // State to store error messages
  const { getCompetitionTemplates, deleteTemplate } = useApi(); // Destructuring API methods from custom hook
  const { code } = useParams(); // Getting competition code from URL parameters
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getCompetitionTemplates({
          competitionCode: code, // Fetching templates based on competition code
        });
        setTemplates(templates); // Updating state with fetched templates
      } catch (err) {
        setError("Failed to fetch templates. Please try again later."); // Setting error message if fetch fails
        console.error(err); // Logging error to console
      }
    };
    fetchTemplates(); // Calling the fetch function on component mount
  }, [code, getCompetitionTemplates]); // Dependency array to re-run effect if code or getCompetitionTemplates changes

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate({ templateId }); // Deleting template by ID
      const templates = await getCompetitionTemplates({
        competitionCode: code, // Re-fetching templates after deletion
      });
      setTemplates(templates); // Updating state with new templates list
    } catch (err) {
      setError("Failed to delete template. Please try again later."); // Setting error message if delete fails
      console.error(err); // Logging error to console
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      {" "}
      {/* Container with padding and background color */}
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Templates
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div> // Displaying error message if exists
      )}
      <button
        onClick={() => navigate(`/competition/${code}/edit-templates/new`)} // Navigating to create new template page
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6"
      >
        Create New Template
      </button>
      {templates.map((template) => (
        <div
          key={template._id} // Unique key for each template
          className="bg-white p-4 rounded-lg shadow-md space-y-4 mb-4"
        >
          <h3 className="text-xl font-semibold text-yellow-700">
            {template.title} {/* Displaying template title */}
          </h3>
          <p>{template.description}</p> {/* Displaying template description */}
          {template.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <p className="font-semibold">{field.name}</p>{" "}
              {/* Displaying field name */}
              <p>{field.type}</p> {/* Displaying field type */}
            </div>
          ))}
          <button
            onClick={() => handleDeleteTemplate(template._id)} // Deleting template on button click
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminEditTemplates; // Exporting component as default
