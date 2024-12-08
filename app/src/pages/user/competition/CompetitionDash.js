import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const CompetitionDash = ({ user }) => {
  const {
    getCompetition,
    getCompetitionTemplates,
    getUserForms,
    getFiles,
    getPosts,
    getWordlists,
  } = useApi();
  const [code, setCode] = useState(useParams().code);

  const [competition, setCompetition] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [wordlists, setWordlists] = useState([]);

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code: code });
      setCompetition(competition);
    };
    fetchCompetition();

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

    const fetchPosts = async () => {
      const posts = await getPosts({ competitionCode: code });
      setPosts(posts);
    };
    fetchPosts();

    const fetchWordlists = async () => {
      const wordlists = await getWordlists({ competitionCode: code });
      setWordlists(wordlists);
    };
    fetchWordlists();
  }, []);

  return (
    <div className="bg-yellow-50 text-gray-800">
      <div className="flex">
        <aside className="w-64 bg-yellow-200 p-4">
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
                    const isComplete = item.condition.startsWith("COMPLETE");
                    const formId = isComplete
                      ? item.condition.match(/\(([^)]+)\)/)[1]
                      : null;
                    const form = forms.find(
                      (form) => form.templateId === formId
                    );
                    let isChecked = false;
                    if (form) {
                      isChecked = true;
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

export default CompetitionDash;
