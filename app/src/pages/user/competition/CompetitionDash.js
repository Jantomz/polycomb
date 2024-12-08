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
      console.log(competition);
      setCompetition(competition);
    };
    fetchCompetition();

    const fetchTemplates = async () => {
      const templates = await getCompetitionTemplates({
        competitionCode: code,
      });
      console.log(templates);
      setTemplates(templates);
    };
    fetchTemplates();

    const fetchForms = async () => {
      const forms = await getUserForms({
        competitionCode: code,
        userId: user.uid,
      });
      console.log(forms);
      setForms(forms);
    };
    fetchForms();

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
            {templates?.map((template) =>
              !forms.find((form) => form.templateId === template._id) ? (
                <div
                  key={template._id}
                  style={{
                    border: "1px solid black",
                  }}
                >
                  <Link to={`/competition/${code}/form/${template._id}`}>
                    {template.title}
                  </Link>
                </div>
              ) : (
                <div>Already Filled Out</div>
              )
            )}
          </div>
          <div>
            <h1>Checklist</h1>
            {competition.checklist.map((item) => {
              const isComplete = item.condition.startsWith("COMPLETE");
              const formId = isComplete
                ? item.condition.match(/\(([^)]+)\)/)[1]
                : null;
              const form = forms.find((form) => form.templateId === formId);
              let isChecked = false;
              if (form) {
                isChecked = true;
              }

              return (
                <div key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <input type="checkbox" checked={isChecked} readOnly />
                </div>
              );
            })}
          </div>
        </>
      )}
      <h1>Files</h1>
      {files.map((file) => (
        <div key={file.id}>
          <a
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
            View Wordlist
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CompetitionDash;
