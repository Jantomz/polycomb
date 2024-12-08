import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import PDFViewer from "../../../components/misc/PDFViewer.js";
import Post from "../../../components/misc/Post.js";

const CompetitionDash = ({ user }) => {
  const {
    getCompetition,
    getCompetitionTemplates,
    uploadFile,
    getFiles,
    getPosts,
    getWordlists,
    getWord,
    getUsers,
    getTemplateForms,
    deleteFile,
  } = useApi();
  const [code, setCode] = useState(useParams().code);

  const [forms, setForms] = useState([]);

  const [users, setUsers] = useState([]);

  const [files, setFiles] = useState([]);

  const [wordlists, setWordlists] = useState([]);

  const [templates, setTemplates] = useState([]);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  const fetchFiles = async () => {
    console.log("Fetching files");
    const files = await getFiles({ competitionCode: code });
    console.log("files", files);
    setFiles(files);
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code: code });
      console.log(competition);
      setCompetition(competition);

      const users = await getUsers({ competitionCode: code });

      setUsers(users);
    };
    fetchCompetition();

    const fetchTemplates = async () => {
      const templates = await getCompetitionTemplates({
        competitionCode: code,
      });
      console.log(templates);
      setTemplates(templates);
      const forms = await getTemplateForms({
        templateId: templates.find(
          (template) => template.title === "General Information Form"
        )?._id,
      });
      console.log(forms);
      setForms(forms);
    };

    fetchTemplates();

    fetchFiles();

    const fetchWordlists = async () => {
      const wordlists = await getWordlists({ competitionCode: code });
      console.log(wordlists);
      setWordlists(wordlists);
    };

    fetchWordlists();
  }, []);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    console.log(files);
    const handleFileUpload = async () => {
      setLoading(true); // Set loading to true
      const res = await uploadFile({
        file: files[0],
        competitionCode: code,
        creatorId: user.uid,
      });
      console.log(res);
      fetchFiles();
      e.target.value = null;
      setLoading(false); // Set loading to false
    };
    handleFileUpload();
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800">
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
          </nav>
          <h1 className="text-2xl font-bold mb-4">Admin Actions</h1>
          <nav className="space-y-2">
            <Link
              to={`/competition/${code}/edit-schedule`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Create/Edit Schedule
            </Link>
            <Link
              to={`/competition/${code}/edit-timeline`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Create/Edit Timeline
            </Link>
            <Link
              to={`/competition/${code}/edit-checklist`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Create/Edit Checklist
            </Link>
            <Link
              to={`/competition/${code}/edit-posts`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Create/Edit Posts
            </Link>
            <Link
              to={`/competition/${code}/edit-templates`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Create/Edit Form Templates
            </Link>
            <Link
              to={`/competition/${code}/add-wordlist`}
              className="block py-2 px-4 bg-yellow-300 rounded hover:bg-yellow-400"
            >
              Add Word List
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
                <div className="mt-4">
                  <h4 className="text-xl font-semibold">Participants</h4>
                  {competition.participants.length > 0 ? (
                    competition.participants.map((participant) => (
                      <p key={participant}>{participant}</p>
                    ))
                  ) : (
                    <p>Nothing here!</p>
                  )}
                </div>
              </section>
              <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Forms</h3>
                {templates.length > 0 ? (
                  templates.map((form) => (
                    <div
                      key={form._id}
                      className="mb-4 p-4 bg-yellow-100 rounded"
                    >
                      <h4 className="text-xl font-semibold">{form.title}</h4>
                      <p>{form.creatorId}</p>
                      <p>{form.competitionCode}</p>
                      {form.fields.map((field) => (
                        <p key={field.name}>
                          {field.name} - {field.type}
                        </p>
                      ))}
                      <Link
                        to={`/competition/${code}/form/${form._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Answers
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>Nothing here!</p>
                )}
              </section>
              <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Timeline</h3>
                {competition.timeline.length > 0 ? (
                  competition.timeline.map((item) => (
                    <div
                      key={item.name}
                      className="mb-4 p-4 bg-yellow-100 rounded"
                    >
                      <h4 className="text-xl font-semibold">{item.name}</h4>
                      <p>{item.description}</p>
                      <p>
                        {new Date(item.startDate).toLocaleDateString()}{" "}
                        {item.startDate !== item.endDate && (
                          <span>
                            to {new Date(item.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Nothing here!</p>
                )}
              </section>
              <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Checklist</h3>
                {competition.checklist.length > 0 ? (
                  competition.checklist.map((item) => (
                    <div
                      key={item.name}
                      className="mb-4 p-4 bg-yellow-100 rounded"
                    >
                      <h4 className="text-xl font-semibold">{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p>Nothing here!</p>
                )}
              </section>
            </>
          ) : (
            <p>Nothing here!</p>
          )}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Upload Files</h3>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e)}
              className="block w-full text-gray-700 py-2 px-4 border border-gray-300 rounded"
              disabled={loading} // Disable input while loading
            />
            {loading && <p>Uploading...</p>} {/* Loading indicator */}
          </section>
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Files</h3>
            {files.length > 0 ? (
              files.map((file) => (
                <div
                  key={file.fileId}
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
                  <button
                    onClick={() => {
                      const confirmDelete = async () => {
                        const res = await deleteFile({ fileId: file.fileId });
                        console.log(res);
                        fetchFiles();
                      };
                      confirmDelete();
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete File
                  </button>
                </div>
              ))
            ) : (
              <p>Nothing here!</p>
            )}
          </section>
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
                    Edit Wordlist
                  </Link>
                </div>
              ))
            ) : (
              <p>Nothing here!</p>
            )}
          </section>
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">User Ids</h3>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.uid} className="mb-4 p-4 bg-yellow-100 rounded">
                  <h4 className="text-xl font-semibold">{user.uid}</h4>
                </div>
              ))
            ) : (
              <p>Nothing here!</p>
            )}
          </section>
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Participant Stats</h3>
            {users.length > 0 ? (
              <>
                <p>Number of Participants: {users.length}</p>
                <p>
                  Average Number of Wordlists Being Studied per Participant:{" "}
                  {users.reduce(
                    (acc, user) => acc + user.wordlistsStudyDepth.length,
                    0
                  ) / users.length}
                </p>
                {forms.length > 0 && (
                  <>
                    <p>
                      Percentage of Participants Who Have Completed the General
                      Information: {` `}
                      {(forms.length / users.length) * 100}%
                    </p>
                    <p>
                      Average Grade on General Information:{" "}
                      {(() => {
                        if (forms.length === 0) return "N/A";

                        const grades = forms.map((form) =>
                          parseInt(form.answers[0].Grade, 10)
                        );

                        const mean =
                          grades.reduce((acc, grade) => acc + grade, 0) /
                          grades.length;

                        const sortedGrades = [...grades].sort((a, b) => a - b);
                        const median =
                          sortedGrades.length % 2 === 0
                            ? (sortedGrades[sortedGrades.length / 2 - 1] +
                                sortedGrades[sortedGrades.length / 2]) /
                              2
                            : sortedGrades[Math.floor(sortedGrades.length / 2)];

                        const mode = (() => {
                          const frequency = {};
                          let maxFreq = 0;
                          let mode;
                          grades.forEach((grade) => {
                            frequency[grade] = (frequency[grade] || 0) + 1;
                            if (frequency[grade] > maxFreq) {
                              maxFreq = frequency[grade];
                              mode = grade;
                            }
                          });
                          return mode;
                        })();

                        return (
                          <>
                            <p>Mean: {mean.toFixed(2)}</p>
                            <p>Median: {median.toFixed(2)}</p>
                            <p>Mode: {mode.toFixed(0)}</p>
                          </>
                        );
                      })()}
                    </p>
                    <p>
                      Frequency of Each Grade in General Information Form:{" "}
                      {(() => {
                        if (forms.length === 0) return "N/A";

                        const grades = forms.map((form) =>
                          parseInt(form.answers[0].Grade, 10)
                        );

                        const frequency = {};
                        grades.forEach((grade) => {
                          frequency[grade] = (frequency[grade] || 0) + 1;
                        });

                        return (
                          <ul>
                            {Object.entries(frequency).map(([grade, count]) => (
                              <li key={grade}>
                                Grade {grade}: {count} participant
                                {count > 1 ? "s" : ""}
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                    </p>
                  </>
                )}
              </>
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
