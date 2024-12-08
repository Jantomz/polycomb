import { useEffect, useState } from "react";
import useApi from "../hooks/useApi.js";
import { Link, useParams } from "react-router-dom";

const ViewCompetitionForms = ({ user, userData }) => {
  const { code } = useParams();
  const { getCompetitionTemplates, getUserForms } = useApi();

  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templates = await getCompetitionTemplates({
        competitionCode: code,
      });
      setTemplates(templates);
    };
    fetchTemplates();

    const fetchForms = async () => {
      const forms = await getUserForms({
        competitionCode: code,
        userId: user.uid,
      });
      setForms(forms);
    };
    fetchForms();
  }, []);

  return (
    <section className=" mx-auto p-8">
      <h3 className="text-3xl font-bold mb-6 text-center">
        {user.displayName || user.email}'s Forms for this Competition
      </h3>
      {templates.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center gap-12">
          {templates.map((template) =>
            !forms.find((form) => form.templateId === template._id) ? (
              <Link
                to={`/competition/${code}/form/${template._id}`}
                className="text-blue-500 hover:underline text-lg font-semibold"
              >
                <div
                  key={template._id}
                  className="p-6 bg-yellow-100 rounded shadow-md"
                >
                  {template.title}
                </div>
              </Link>
            ) : (
              <div
                key={template._id}
                className="p-6 bg-green-100 rounded shadow-md text-center"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Already Filled Out
                </span>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nothing here!</p>
      )}
    </section>
  );
};

export default ViewCompetitionForms;
