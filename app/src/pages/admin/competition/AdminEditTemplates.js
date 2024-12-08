import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditTemplates = ({ user, userData }) => {
  const { getCompetitionTemplates } = useApi();
  const competitionCode = useParams().code;
  const [templates, setTemplates] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const performInitialRender = async () => {
      const templates = await getCompetitionTemplates({
        competitionCode,
      });
      setTemplates(templates);
    };
    performInitialRender();
  }, [userData]);

  return (
    <div>
      <h1>Edit Templates</h1>
      <button
        onClick={() => {
          navigate(`/competition/${competitionCode}/edit-templates/new`);
        }}
      >
        Create New Template
      </button>
      {templates.map((template) => (
        <div key={template._id}>
          <h3>{template.title}</h3>
          <p>{template.description}</p>
          {template.fields.map((field, index) => (
            <div key={index}>
              <p>{field.name}</p>
              <p>{field.type}</p>
            </div>
          ))}
          <button
            onClick={() => {
              setShowDeletePopup(true);
              setTemplateToDelete(template);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      {/* {showDeletePopup && (
                <DeletePopup
                    deleteFunction={deleteTemplate}
                    itemToDelete={templateToDelete}
                    setItemToDelete={setTemplateToDelete}
                    setShowDeletePopup={setShowDeletePopup}
                />
            )} */}
    </div>
  );
};

export default AdminEditTemplates;
