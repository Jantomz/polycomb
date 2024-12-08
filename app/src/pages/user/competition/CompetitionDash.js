import { useEffect, useState } from "react"; // Importing necessary hooks from React
import { Link, useParams } from "react-router-dom"; // Importing components from react-router-dom for navigation
import useApi from "../../../hooks/useApi.js"; // Custom hook to interact with API

const CompetitionDash = ({ user }) => {
  const { getCompetition, getUserForms, getWordlists } = useApi(); // Destructuring API methods from custom hook

  const { code } = useParams(); // Extracting competition code from URL parameters
  const [competition, setCompetition] = useState(null); // State to store competition data
  const [forms, setForms] = useState([]); // State to store user forms
  const [wordlists, setWordlists] = useState([]); // State to store wordlists
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code: code }); // Fetching competition data
        setCompetition(competition); // Updating state with fetched competition data
      } catch (err) {
        setError("Failed to fetch competition data."); // Setting error message if fetching fails
      }
    };
    fetchCompetition(); // Calling the function to fetch competition data

    const fetchForms = async () => {
      try {
        const forms = await getUserForms({
          competitionCode: code,
          userId: user.uid,
        }); // Fetching user forms
        setForms(forms); // Updating state with fetched forms
      } catch (err) {
        setError("Failed to fetch user forms."); // Setting error message if fetching fails
      }
    };
    fetchForms(); // Calling the function to fetch user forms

    const fetchWordlists = async () => {
      try {
        const wordlists = await getWordlists({ competitionCode: code }); // Fetching wordlists
        setWordlists(wordlists); // Updating state with fetched wordlists
      } catch (err) {
        setError("Failed to fetch wordlists."); // Setting error message if fetching fails
      }
    };
    fetchWordlists(); // Calling the function to fetch wordlists
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="bg-yellow-50 text-gray-800">
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-yellow-200 p-4">
          <h1 className="text-2xl font-bold mb-4">General Actions</h1>
          <nav className="space-y-2 mb-6">
            <Link
              to={`/competition/${code}/posts`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              View Posts
            </Link>
            <Link
              to={`/competition/${code}/schedule`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              View Schedule
            </Link>
            <Link
              to={`/competition/${code}/forms`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              View Forms
            </Link>

            <Link
              to={`/competition/${code}/files`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              View Files
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {error && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
              {error} {/* Displaying error message if any */}
            </div>
          )}
          {competition ? (
            <>
              <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">
                  {competition.title} Dashboard
                </h3>
                <h2 className="text-xl font-semibold mb-4">
                  Join Code:{" "}
                  <span className="font-bold text-yellow-500">{code}</span>
                </h2>
                <p>{competition.description}</p>
                <p>
                  Start Date:{" "}
                  {new Date(competition.startDate).toLocaleDateString()}
                </p>
                <p>
                  End Date: {new Date(competition.endDate).toLocaleDateString()}
                </p>
              </section>
              <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Checklist</h3>
                {competition.checklist.length > 0 ? (
                  competition.checklist.map((item) => {
                    const isComplete = item.condition.startsWith("COMPLETE"); // Checking if the checklist item is complete
                    const formId = isComplete
                      ? item.condition.match(/\(([^)]+)\)/)[1]
                      : null; // Extracting form ID if the item is complete
                    const form = forms.find(
                      (form) => form.templateId === formId
                    ); // Finding the form with the extracted form ID
                    let isChecked = false;
                    if (form) {
                      isChecked = true; // Marking the checklist item as checked if the form is found
                    }

                    return (
                      <div
                        key={item.name}
                        className="mb-4 p-4 bg-yellow-100 rounded flex items-start justify-center"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mr-2 h-5 w-5 accent-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">{item.name}</h4>
                          <p className="text-sm text-left">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Nothing here!</p>
                )}
              </section>
            </>
          ) : (
            <p>Nothing here!</p>
          )}

          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Wordlists</h3>
            {wordlists.length > 0 ? (
              wordlists.map((wordlist) => (
                <div
                  key={wordlist._id}
                  className="mb-4 p-4 bg-yellow-100 rounded"
                >
                  <h4 className="text-xl font-semibold">{wordlist.title}</h4>
                  <p>{wordlist.description}</p>
                  <Link
                    to={`/competition/${code}/wordlist/${wordlist._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Wordlist
                  </Link>
                </div>
              ))
            ) : (
              <p>Nothing here!</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CompetitionDash; // Exporting the component as default
