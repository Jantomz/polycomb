const BASE_URL = "http://localhost:8080/api";

const useApi = () => {
  // TODO: Find a solution to make sure the code is not doubled up on, implement the code creation here
  const createCompetition = async (
    title,
    description,
    code,
    startDate,
    endDate,
    admins
  ) => {
    console.log(
      "Received:",
      title,
      description,
      code,
      startDate,
      endDate,
      admins
    );
    try {
      const response = await fetch(`${BASE_URL}/competition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          admins,
          code,
          startDate,
          endDate,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error creating competition: ", error);
    }
  };

  const addCompetition = async ({ code, userId }) => {
    try {
      console.log("Adding competition to user: ", code, userId);
      const response = await fetch(`${BASE_URL}/user/add-competition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          userId,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error adding competition to user: ", error);
    }
  };

  const getUserCompetitions = async ({ userId }) => {
    try {
      console.log("Getting competitions for user: ", userId);
      const response = await fetch(`${BASE_URL}/user/competitions/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting competitions for user: ", error);
    }
  };

  const getCompetition = async ({ code }) => {
    try {
      console.log("Getting competition: ", code);
      const response = await fetch(`${BASE_URL}/competition/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting competition: ", error);
    }
  };

  const addParticipant = async ({ code, userId }) => {
    try {
      console.log("Adding participant to competition: ", code, userId);
      const response = await fetch(`${BASE_URL}/competition/add-participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          userId,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error adding participant to competition: ", error);
    }
  };

  const updateSchedule = async ({ code, schedule }) => {
    try {
      console.log("Updating schedule for competition: ", code, schedule);
      const response = await fetch(`${BASE_URL}/competition/update-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          schedule,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error updating schedule for competition: ", error);
    }
  };

  const createTemplate = async ({
    title,
    creatorId,
    competitionCode,
    fields,
  }) => {
    try {
      console.log("Creating template with title: ", title);
      const response = await fetch(`${BASE_URL}/form/create-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          creatorId,
          competitionCode,
          fields,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error creating template: ", error);
    }
  };

  const getCompetitionTemplates = async ({ competitionCode }) => {
    try {
      console.log("Getting forms for competition: ", competitionCode);
      const response = await fetch(
        `${BASE_URL}/form/competition-templates/${competitionCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting forms for competition: ", error);
    }
  };

  const getTemplate = async ({ templateId }) => {
    try {
      console.log("Getting template: ", templateId);
      const response = await fetch(`${BASE_URL}/form/templates/${templateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting template: ", error);
    }
  };

  const submitForm = async ({ templateId, answers, signature, uid }) => {
    try {
      console.log("Submitting form: ", templateId, answers, signature);
      // TODO: check if template matches answer format

      const template = await getTemplate({ templateId });

      if (!template) {
        console.error("Template not found");
        return;
      }

      console.log("Template: ", template);

      const title = template.title;
      const creatorId = uid;
      const competitionCode = template.competitionCode;
      const fields = template.fields;

      const response = await fetch(`${BASE_URL}/form/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          creatorId,
          templateId,
          competitionCode,
          fields,
          answers,
          signature,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const getUserForms = async ({ competitionCode, userId }) => {
    try {
      console.log("Getting forms for user: ", competitionCode, userId);
      const response = await fetch(
        `${BASE_URL}/form/user-forms/${competitionCode}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting forms for user: ", error);
    }
  };

  // Ensure admin is the only one who can access this
  const getTemplateForms = async ({ templateId }) => {
    try {
      console.log("Getting forms for template: ", templateId);
      const response = await fetch(
        `${BASE_URL}/form/template-forms/${templateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting forms for template: ", error);
    }
  };

  const updateTimeline = async ({ code, timeline }) => {
    try {
      console.log("Updating timeline for competition: ", code, timeline);
      const response = await fetch(`${BASE_URL}/competition/update-timeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          timeline,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error updating timeline for competition: ", error);
    }
  };

  const updateChecklist = async ({ code, checklist }) => {
    try {
      console.log("Updating checklist for competition: ", code, checklist);
      const response = await fetch(`${BASE_URL}/competition/update-checklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          checklist,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error updating checklist for competition: ", error);
    }
  };

  const uploadFile = async ({ file, creatorId, competitionCode }) => {
    try {
      console.log("Uploading file: ", file);
      console.log("Creator ID: ", creatorId);
      console.log("Competition Code: ", competitionCode);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("creatorId", creatorId);
      formData.append("competitionCode", competitionCode);

      const response = await fetch(`${BASE_URL}/file/`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const getFiles = async ({ competitionCode }) => {
    console.log("Getting files for competition: ", competitionCode);
    try {
      console.log("Getting all files");
      const response = await fetch(
        `${BASE_URL}/file/competition/${competitionCode}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting files: ", error);
    }
  };

  const getPosts = async ({ competitionCode }) => {
    console.log("Getting posts for competition: ", competitionCode);
    try {
      console.log("Getting all posts");
      const response = await fetch(
        `${BASE_URL}/post/competition/${competitionCode}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting posts: ", error);
    }
  };

  const createPost = async ({
    title,
    content,
    creatorId,
    competitionCode,
    tags,
    description,
    images,
  }) => {
    try {
      console.log(
        "Creating post: ",
        title,
        content,
        creatorId,
        competitionCode
      );
      const response = await fetch(`${BASE_URL}/post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          creatorId,
          competitionCode,
          tags,
          description,
          images,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  const createWordlist = async ({
    title,
    description,
    competitionCode,
    creatorId,
    words,
  }) => {
    try {
      console.log(
        "Creating wordlist: ",
        title,
        description,
        competitionCode,
        creatorId,
        words
      );
      const response = await fetch(`${BASE_URL}/wordlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          competitionCode,
          creatorId,
          words,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error creating wordlist: ", error);
    }
  };

  const getWordlists = async ({ competitionCode }) => {
    console.log("Getting wordlists for competition: ", competitionCode);
    try {
      console.log("Getting all wordlists");
      const response = await fetch(
        `${BASE_URL}/wordlist/competition/${competitionCode}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting wordlists: ", error);
    }
  };

  const getWord = async ({ wordId }) => {
    console.log("Getting word: ", wordId);
    try {
      const response = await fetch(`${BASE_URL}/wordlist/word/${wordId}`, {
        method: "GET",
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting word: ", error);
    }
  };

  const getWordlist = async ({ competitionCode, wordlistId }) => {
    console.log("Getting wordlist: ", competitionCode, wordlistId);
    try {
      const response = await fetch(
        `${BASE_URL}/wordlist/competition/${competitionCode}/${wordlistId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      console.log("Wordlist: ", data);

      return data;
    } catch (error) {
      console.error("Error getting wordlist: ", error);
    }
  };

  const uploadAudio = async ({ audio, creatorId, wordId }) => {
    try {
      console.log("Posting audio: ", audio);
      const formData = new FormData();
      formData.append("audio", audio);
      formData.append("creatorId", creatorId);
      formData.append("wordId", wordId);

      const response = await fetch(`${BASE_URL}/audio/`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data && data.dbAudio.audioId) {
        await fetch(`${BASE_URL}/wordlist/word/${wordId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioId: data.dbAudio.audioId,
          }),
        });
      }

      return data;
    } catch (error) {
      console.error("Error posting audio: ", error);
    }
  };

  const getAudioStream = async ({ id }) => {
    console.log("Getting audio stream: ", id);
    try {
      const response = await fetch(`${BASE_URL}/audio/${id}`, {
        method: "GET",
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting audio stream: ", error);
    }
  };

  const setWordlistPractice = async ({
    userId,
    wordlistId,
    order,
    currentIndex,
  }) => {
    console.log(
      "Setting practice for user: ",
      userId,
      wordlistId,
      order,
      currentIndex
    );
    try {
      const response = await fetch(`${BASE_URL}/user/set-wordlist-practice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          wordlistId,
          order,
          currentIndex,
        }),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error setting practice for user: ", error);
    }
  };

  const getUsers = async ({ competitionCode }) => {
    console.log("Getting users: ", competitionCode);

    try {
      const response = await fetch(
        `${BASE_URL}/user/competition/${competitionCode}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      console.log("Users: ", data);

      return data;
    } catch (error) {
      console.error("Error getting users: ", error);
    }
  };

  const generateWordFrequency = async ({ word }) => {
    console.log("Generating word frequency: ", word);

    try {
      const response = await fetch(
        `${BASE_URL}/tool/generate-difficulty-rating/${word}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      console.log("Word frequency: ", data);

      return data;
    } catch (error) {
      console.error("Error generating word frequency: ", error);
    }
  };

  // TODO: Set up delete and update endpoints later on

  return {
    createCompetition,
    addCompetition,
    getUserCompetitions,
    getCompetition,
    addParticipant,
    updateSchedule,
    createTemplate,
    getCompetitionTemplates,
    getTemplate,
    submitForm,
    getUserForms,
    getTemplateForms,
    updateTimeline,
    updateChecklist,
    uploadFile,
    getFiles,
    getPosts,
    createPost,
    createWordlist,
    getWordlists,
    getWord,
    getWordlist,
    uploadAudio,
    getAudioStream,
    setWordlistPractice,
    getUsers,
    generateWordFrequency,
  };
};

export default useApi;
