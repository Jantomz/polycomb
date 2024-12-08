import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const { getCompetitionTemplates, deleteTemplate } = useApi();
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getCompetitionTemplates({
          competitionCode: code,
        });
        setTemplates(templates);
      } catch (err) {
        setError("Failed to fetch templates. Please try again later.");
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate({ templateId });
      const templates = await getCompetitionTemplates({
        competitionCode: code,
      });
      setTemplates(templates);
    } catch (err) {
      setError("Failed to delete template. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Templates
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}
      <button
        onClick={() => navigate(`/competition/${code}/edit-templates/new`)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6"
      >
        Create New Template
      </button>
      {templates.map((template) => (
        <div
          key={template._id}
          className="bg-white p-4 rounded-lg shadow-md space-y-4 mb-4"
        >
          <h3 className="text-xl font-semibold text-yellow-700">
            {template.title}
          </h3>
          <p>{template.description}</p>
          {template.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <p className="font-semibold">{field.name}</p>
              <p>{field.type}</p>
            </div>
          ))}
          <button
            onClick={() => handleDeleteTemplate(template._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminEditTemplates;
