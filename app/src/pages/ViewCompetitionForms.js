import { useEffect, useState } from "react";
import useApi from "../hooks/useApi.js";
import { Link, useParams } from "react-router-dom";

const ViewCompetitionForms = ({ user, userData }) => {
  const { code } = useParams(); // Extracts the competition code from the URL parameters
  const { getCompetitionTemplates, getUserForms } = useApi(); // Custom hook to fetch API data

  const [templates, setTemplates] = useState([]); // State to store competition templates
  const [forms, setForms] = useState([]); // State to store user forms
  const [error, setError] = useState(null); // State to store any error messages

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getCompetitionTemplates({
          competitionCode: code, // Passes the competition code to the API call
        });
        setTemplates(templates); // Updates the state with fetched templates
      } catch (err) {
        setError("Failed to fetch competition templates."); // Sets error message if API call fails
        console.error(err); // Logs the error to the console
      }
    };

    const fetchForms = async () => {
      try {
        const forms = await getUserForms({
          competitionCode: code, // Passes the competition code to the API call
          userId: user.uid, // Passes the user ID to the API call
        });
        setForms(forms); // Updates the state with fetched forms
      } catch (err) {
        setError("Failed to fetch user forms."); // Sets error message if API call fails
        console.error(err); // Logs the error to the console
      }
    };

    fetchTemplates(); // Initiates fetching of competition templates
    fetchForms(); // Initiates fetching of user forms
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <section className="mx-auto p-8">
      <h3 className="text-3xl font-bold mb-6 text-center">
        {user.displayName || user.email}'s Forms for this Competition
      </h3>
      {error && <p className="text-center text-red-500">{error}</p>}{" "}
      {/* Displays error message if any */}
      {templates.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center gap-12">
          {templates.map((template) =>
            !forms.find((form) => form.templateId === template._id) ? ( // Checks if the form for this template is already filled out
              <Link
                to={`/competition/${code}/form/${template._id}`} // Link to fill out the form
                className="text-blue-500 hover:underline text-lg font-semibold"
                key={template._id}
              >
                <div className="p-6 bg-yellow-100 rounded shadow-md">
                  {template.title} {/* Displays the title of the template */}
                </div>
              </Link>
            ) : (
              <div
                key={template._id}
                className="p-6 bg-green-100 rounded shadow-md text-center"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Already Filled Out{" "}
                  {/* Indicates the form is already filled out */}
                </span>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nothing here!</p> // Message when no templates are available
      )}
    </section>
  );
};

export default ViewCompetitionForms;
