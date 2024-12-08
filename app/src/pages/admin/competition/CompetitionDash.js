import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import PDFViewer from "../../../components/misc/PDFViewer.js";

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
  } = useApi();
  const [code, setCode] = useState(useParams().code);

  const [forms, setForms] = useState([]);

  const [users, setUsers] = useState([]);

  const [files, setFiles] = useState([]);

  const [posts, setPosts] = useState([]);

  const [wordlists, setWordlists] = useState([]);

  const [templates, setTemplates] = useState([]);
  const [competition, setCompetition] = useState(null);

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

    const fetchFiles = async () => {
      console.log("Fetching files");
      const files = await getFiles({ competitionCode: code });
      console.log("files", files);
      setFiles(files);
    };

    fetchFiles();

    const fetchPosts = async () => {
      const posts = await getPosts({ competitionCode: code });
      console.log(posts);
      setPosts(posts);
    };

    fetchPosts();

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
    uploadFile({ file: files[0], competitionCode: code, creatorId: user.uid });
  };

  return (
    <div>
      <h1>Competition Dashboard</h1>
      <h2>{code}</h2>
      {competition && (
        <>
          <div>
            <h3>{competition.title}</h3>
            <p>{competition.description}</p>
            <p>{new Date(competition.startDate).toLocaleDateString()}</p>
            <p>{new Date(competition.endDate).toLocaleDateString()}</p>
            {competition.participants.map((participant) => (
              <p key={participant}>{participant}</p>
            ))}
          </div>
          <div>
            <h1>Schedule</h1>

            {competition.schedule.map((event) => (
              <div key={event.name}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>{new Date(event.startDate).toLocaleDateString()}</p>
                <p>{new Date(event.endDate).toLocaleDateString()}</p>
                <p>{event.startTime}</p>
                <p>{event.endTime}</p>
              </div>
            ))}
          </div>
          <div>
            <h1>Forms</h1>
            {templates?.map((form) => (
              <div
                key={form._id}
                style={{
                  border: "1px solid black",
                }}
              >
                <h3>{form.title}</h3>
                <p>{form.creatorId}</p>
                <p>{form.competitionCode}</p>
                {form.fields.map((field) => (
                  <p key={field.name}>
                    {field.name} - {field.type}
                  </p>
                ))}
                <Link to={`/competition/${code}/form/${form._id}`}>
                  View Answers
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h1>Timeline</h1>
            {competition.timeline.map((item) => (
              <div key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>{new Date(item.startDate).toLocaleDateString()}</p>
                <p>{new Date(item.endDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div>
            <h1>Checklist</h1>
            {competition.checklist.map((item) => {
              return (
                <div key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div>
        <h1>Upload Files</h1>
        <input type="file" onChange={(e) => handleFileUpload(e)} />
      </div>
      <h1>Files</h1>
      {files.map((file) => (
        <div key={file.id}>
          <a
            // TODO: Need to change this to the correct URL
            href={`http://localhost:8080/api/file/${file.fileId}`}
            target="_blank"
            rel="noreferrer"
          >
            {file.filename}
          </a>
        </div>
      ))}
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.content.map((content, index) => (
            <div key={index}>
              <p>{content}</p>
              {post.images[index] && (
                <img src={post.images[index]} alt="post"></img>
              )}
            </div>
          ))}
        </div>
      ))}
      <h1>Wordlists</h1>
      {wordlists.map((wordlist) => (
        <div
          key={wordlist._id}
          style={{
            border: "1px solid black",
          }}
        >
          <h3>{wordlist.title}</h3>
          <p>{wordlist.description}</p>
          <Link to={`/competition/${code}/wordlist/${wordlist._id}`}>
            Edit Wordlist
          </Link>
        </div>
      ))}

      <h1>Users</h1>
      {users.map((user) => (
        <div key={user.uid}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
      <h1>Participant Stats</h1>
      <h2>Number of Participants: {users.length}</h2>
      <h2>
        Average Number of Wordlists Being Studied per Participant:{" "}
        {users.reduce((acc, user) => acc + user.wordlistsStudyDepth.length, 0) /
          users.length}
      </h2>
      {forms.length > 0 && (
        <>
          <h2>
            Percentage of Participants Who Have Completed the General
            Information: {` `}
            {(forms.length / users.length) * 100}%
          </h2>
          <h2>
            Average Grade on General Information:{" "}
            {(() => {
              if (forms.length === 0) return "N/A";

              const grades = forms.map((form) =>
                parseInt(form.answers[0].Grade, 10)
              );

              const mean =
                grades.reduce((acc, grade) => acc + grade, 0) / grades.length;

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
          </h2>
          <h2>
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
                      Grade {grade}: {count} participant{count > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              );
            })()}
          </h2>
        </>
      )}

      <h1>Admin Actions</h1>

      <Link to={`/competition/${code}/edit-schedule`}>Edit Schedule</Link>
      <br />
      <Link to={`/competition/${code}/edit-timeline`}>Edit Timeline</Link>
      <br />
      <Link to={`/competition/${code}/edit-checklist`}>Edit Checklist</Link>
      <br />
      <Link to={`/competition/${code}/edit-posts`}>Edit Posts</Link>
      <br />
      <Link to={`/competition/${code}/edit-templates`}>
        Edit Form Templates
      </Link>
      <br />
      <Link to={`/competition/${code}/add-wordlist`}>Add Word List</Link>
    </div>
  );
};

export default CompetitionDash;
