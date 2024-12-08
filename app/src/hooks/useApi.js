const BASE_URL = "http://localhost:8080/api";

const useApi = () => {
  const apiRequest = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error in API request to ${url}: `, error);
      throw error;
    }
  };

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
      const response = await apiRequest(`${BASE_URL}/competition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          admins,
          code,
          startDate,
          endDate,
        }),
      });
      return response;
    } catch (error) {
      console.error("Error creating competition:", error);
      throw new Error("Failed to create competition. Please try again later.");
    }
  };

  const getUser = async ({ uid }) => {
    return apiRequest(`${BASE_URL}/auth/${uid}`, { method: "GET" });
  };

  const addCompetition = async ({ code, userId }) => {
    console.log("Adding competition to user: ", code, userId);
    return apiRequest(`${BASE_URL}/user/add-competition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userId }),
    });
  };

  const getUserCompetitions = async ({ userId }) => {
    console.log("Getting competitions for user: ", userId);
    return apiRequest(`${BASE_URL}/user/competitions/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  };

  const getCompetition = async ({ code }) => {
    console.log("Getting competition: ", code);
    return apiRequest(`${BASE_URL}/competition/${code}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  };

  const addParticipant = async ({ code, userId }) => {
    console.log("Adding participant to competition: ", code, userId);
    return apiRequest(`${BASE_URL}/competition/add-participant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userId }),
    });
  };

  const updateSchedule = async ({ code, schedule }) => {
    console.log("Updating schedule for competition: ", code, schedule);
    return apiRequest(`${BASE_URL}/competition/update-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, schedule }),
    });
  };

  const createTemplate = async ({
    title,
    creatorId,
    competitionCode,
    fields,
  }) => {
    console.log("Creating template with title: ", title);
    return apiRequest(`${BASE_URL}/form/create-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, creatorId, competitionCode, fields }),
    });
  };

  const getCompetitionTemplates = async ({ competitionCode }) => {
    console.log("Getting forms for competition: ", competitionCode);
    return apiRequest(
      `${BASE_URL}/form/competition-templates/${competitionCode}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const getTemplate = async ({ templateId }) => {
    console.log("Getting template: ", templateId);
    return apiRequest(`${BASE_URL}/form/templates/${templateId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  };

  const submitForm = async ({ templateId, answers, signature, uid }) => {
    console.log("Submitting form: ", templateId, answers, signature);
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

    return apiRequest(`${BASE_URL}/form/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  };

  const getUserForms = async ({ competitionCode, userId }) => {
    console.log("Getting forms for user: ", competitionCode, userId);
    return apiRequest(
      `${BASE_URL}/form/user-forms/${competitionCode}/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const getTemplateForms = async ({ templateId }) => {
    console.log("Getting forms for template: ", templateId);
    return apiRequest(`${BASE_URL}/form/template-forms/${templateId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  };

  const updateTimeline = async ({ code, timeline }) => {
    console.log("Updating timeline for competition: ", code, timeline);
    return apiRequest(`${BASE_URL}/competition/update-timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, timeline }),
    });
  };

  const updateChecklist = async ({ code, checklist }) => {
    console.log("Updating checklist for competition: ", code, checklist);
    return apiRequest(`${BASE_URL}/competition/update-checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, checklist }),
    });
  };

  const uploadFile = async ({ file, creatorId, competitionCode }) => {
    console.log("Uploading file: ", file);
    console.log("Creator ID: ", creatorId);
    console.log("Competition Code: ", competitionCode);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("creatorId", creatorId);
    formData.append("competitionCode", competitionCode);

    return apiRequest(`${BASE_URL}/file/`, {
      method: "POST",
      body: formData,
    });
  };

  const getFiles = async ({ competitionCode }) => {
    console.log("Getting files for competition: ", competitionCode);
    return apiRequest(`${BASE_URL}/file/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const getPosts = async ({ competitionCode }) => {
    console.log("Getting posts for competition: ", competitionCode);
    return apiRequest(`${BASE_URL}/post/competition/${competitionCode}`, {
      method: "GET",
    });
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
    console.log("Creating post: ", title, content, creatorId, competitionCode);
    return apiRequest(`${BASE_URL}/post/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  };

  const deletePost = async ({ postId }) => {
    console.log("Deleting post: ", postId);
    return apiRequest(`${BASE_URL}/post/${postId}`, { method: "DELETE" });
  };

  const updatePost = async ({ postId, post }) => {
    console.log("Updating post: ", postId, post);
    return apiRequest(`${BASE_URL}/post/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
  };

  const createWordlist = async ({
    title,
    description,
    competitionCode,
    creatorId,
    words,
  }) => {
    console.log(
      "Creating wordlist: ",
      title,
      description,
      competitionCode,
      creatorId,
      words
    );
    return apiRequest(`${BASE_URL}/wordlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        competitionCode,
        creatorId,
        words,
      }),
    });
  };

  const getWordlists = async ({ competitionCode }) => {
    console.log("Getting wordlists for competition: ", competitionCode);
    return apiRequest(`${BASE_URL}/wordlist/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const getWord = async ({ wordId }) => {
    console.log("Getting word: ", wordId);
    return apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, { method: "GET" });
  };

  const getWordlist = async ({ competitionCode, wordlistId }) => {
    console.log("Getting wordlist: ", competitionCode, wordlistId);
    return apiRequest(
      `${BASE_URL}/wordlist/competition/${competitionCode}/${wordlistId}`,
      { method: "GET" }
    );
  };

  const uploadAudio = async ({ audio, creatorId, wordId, oldAudioId }) => {
    console.log("Posting audio: ", audio);
    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("creatorId", creatorId);
    formData.append("wordId", wordId);

    const data = await apiRequest(`${BASE_URL}/audio/`, {
      method: "POST",
      body: formData,
    });

    if (data && data.dbAudio.audioId) {
      await apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioId: data.dbAudio.audioId }),
      });

      if (oldAudioId) {
        await apiRequest(`${BASE_URL}/audio/${oldAudioId}`, {
          method: "DELETE",
        });
      }

      console.log("Updated word with audio: ", wordId);
    }

    return data;
  };

  const getAudioStream = async ({ id }) => {
    console.log("Getting audio stream: ", id);
    return apiRequest(`${BASE_URL}/audio/${id}`, { method: "GET" });
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
    return apiRequest(`${BASE_URL}/user/set-wordlist-practice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, wordlistId, order, currentIndex }),
    });
  };

  const getUsers = async ({ competitionCode }) => {
    console.log("Getting users: ", competitionCode);
    return apiRequest(`${BASE_URL}/user/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const generateWordFrequency = async ({ word }) => {
    console.log("Generating word frequency: ", word);
    return apiRequest(`${BASE_URL}/tool/generate-difficulty-rating/${word}`, {
      method: "GET",
    });
  };

  const createUser = async ({ user }) => {
    return apiRequest(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid, email: user.email, role: "user" }),
    });
  };

  const deleteTemplate = async ({ templateId }) => {
    console.log("Deleting template: ", templateId);
    return apiRequest(`${BASE_URL}/form/templates/${templateId}`, {
      method: "DELETE",
    });
  };

  const deleteFile = async ({ fileId }) => {
    console.log("Deleting file", fileId);
    return apiRequest(`${BASE_URL}/file/${fileId}`, { method: "DELETE" });
  };

  const deleteWord = async ({ wordId, audioId }) => {
    console.log("Deleting word: ", wordId);
    const data = await apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, {
      method: "DELETE",
    });

    if (audioId) {
      await apiRequest(`${BASE_URL}/audio/${audioId}`, { method: "DELETE" });
    }

    return data;
  };

  const deleteWordlist = async ({ wordlistId }) => {
    console.log("Deleting wordlist: ", wordlistId);
    return apiRequest(`${BASE_URL}/wordlist/wordlist/${wordlistId}`, {
      method: "DELETE",
    });
  };

  return {
    createCompetition,
    addCompetition,
    getUser,
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
    deletePost,
    updatePost,
    createWordlist,
    getWordlists,
    getWord,
    getWordlist,
    uploadAudio,
    getAudioStream,
    setWordlistPractice,
    getUsers,
    generateWordFrequency,
    createUser,
    deleteTemplate,
    deleteFile,
    deleteWord,
    deleteWordlist,
  };
};

export default useApi;
