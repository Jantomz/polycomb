const BASE_URL = "http://localhost:8080/api"; // Base URL for the API

const useApi = () => {
  const apiRequest = async (url, options) => {
    try {
      const response = await fetch(url, options); // Make the API request
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not ok
      }
      return await response.json(); // Parse and return JSON response
    } catch (error) {
      console.error(`Error in API request to ${url}: `, error); // Log error to console
      throw error; // Re-throw error to be handled by caller
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
    try {
      const response = await apiRequest(`${BASE_URL}/competition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({
          title,
          description,
          admins,
          code,
          startDate,
          endDate,
        }), // Convert competition details to JSON string
      });
      return response; // Return the response from the API
    } catch (error) {
      console.error("Error creating competition:", error); // Log error to console
      throw new Error("Failed to create competition. Please try again later."); // Throw user-friendly error
    }
  };

  const getUser = async ({ uid }) => {
    return apiRequest(`${BASE_URL}/auth/${uid}`, { method: "GET" }); // Fetch user data by UID
  };

  const addCompetition = async ({ code, userId }) => {
    return apiRequest(`${BASE_URL}/user/add-competition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ code, userId }), // Convert data to JSON string
    });
  };

  const getUserCompetitions = async ({ userId }) => {
    return apiRequest(`${BASE_URL}/user/competitions/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    });
  };

  const getCompetition = async ({ code }) => {
    return apiRequest(`${BASE_URL}/competition/${code}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    });
  };

  const addParticipant = async ({ code, userId }) => {
    return apiRequest(`${BASE_URL}/competition/add-participant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ code, userId }), // Convert data to JSON string
    });
  };

  const updateSchedule = async ({ code, schedule }) => {
    return apiRequest(`${BASE_URL}/competition/update-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ code, schedule }), // Convert data to JSON string
    });
  };

  const createTemplate = async ({
    title,
    creatorId,
    competitionCode,
    fields,
  }) => {
    return apiRequest(`${BASE_URL}/form/create-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ title, creatorId, competitionCode, fields }), // Convert data to JSON string
    });
  };

  const getCompetitionTemplates = async ({ competitionCode }) => {
    return apiRequest(
      `${BASE_URL}/form/competition-templates/${competitionCode}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
      }
    );
  };

  const getTemplate = async ({ templateId }) => {
    return apiRequest(`${BASE_URL}/form/templates/${templateId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    });
  };

  const submitForm = async ({ templateId, answers, signature, uid }) => {
    const template = await getTemplate({ templateId }); // Fetch template details

    if (!template) {
      console.error("Template not found"); // Log error if template not found
      return;
    }

    const title = template.title;
    const creatorId = uid;
    const competitionCode = template.competitionCode;
    const fields = template.fields;

    return apiRequest(`${BASE_URL}/form/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({
        title,
        creatorId,
        templateId,
        competitionCode,
        fields,
        answers,
        signature,
      }), // Convert form data to JSON string
    });
  };

  const getUserForms = async ({ competitionCode, userId }) => {
    return apiRequest(
      `${BASE_URL}/form/user-forms/${competitionCode}/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
      }
    );
  };

  const getTemplateForms = async ({ templateId }) => {
    return apiRequest(`${BASE_URL}/form/template-forms/${templateId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    });
  };

  const updateTimeline = async ({ code, timeline }) => {
    return apiRequest(`${BASE_URL}/competition/update-timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ code, timeline }), // Convert data to JSON string
    });
  };

  const updateChecklist = async ({ code, checklist }) => {
    return apiRequest(`${BASE_URL}/competition/update-checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ code, checklist }), // Convert data to JSON string
    });
  };

  const uploadFile = async ({ file, creatorId, competitionCode }) => {
    const formData = new FormData(); // Create a new FormData object
    formData.append("file", file); // Append file to FormData
    formData.append("creatorId", creatorId); // Append creatorId to FormData
    formData.append("competitionCode", competitionCode); // Append competitionCode to FormData

    return apiRequest(`${BASE_URL}/file/`, {
      method: "POST",
      body: formData, // Send FormData as body
    });
  };

  const getFiles = async ({ competitionCode }) => {
    return apiRequest(`${BASE_URL}/file/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const getPosts = async ({ competitionCode }) => {
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
    return apiRequest(`${BASE_URL}/post/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({
        title,
        content,
        creatorId,
        competitionCode,
        tags,
        description,
        images,
      }), // Convert post data to JSON string
    });
  };

  const deletePost = async ({ postId }) => {
    return apiRequest(`${BASE_URL}/post/${postId}`, { method: "DELETE" }); // Delete post by ID
  };

  const updatePost = async ({ postId, post }) => {
    return apiRequest(`${BASE_URL}/post/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify(post), // Convert post data to JSON string
    });
  };

  const createWordlist = async ({
    title,
    description,
    competitionCode,
    creatorId,
    words,
  }) => {
    return apiRequest(`${BASE_URL}/wordlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({
        title,
        description,
        competitionCode,
        creatorId,
        words,
      }), // Convert wordlist data to JSON string
    });
  };

  const getWordlists = async ({ competitionCode }) => {
    return apiRequest(`${BASE_URL}/wordlist/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const getWord = async ({ wordId }) => {
    return apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, { method: "GET" });
  };

  const getWordlist = async ({ competitionCode, wordlistId }) => {
    return apiRequest(
      `${BASE_URL}/wordlist/competition/${competitionCode}/${wordlistId}`,
      { method: "GET" }
    );
  };

  const uploadAudio = async ({ audio, creatorId, wordId, oldAudioId }) => {
    const formData = new FormData(); // Create a new FormData object
    formData.append("audio", audio); // Append audio file to FormData
    formData.append("creatorId", creatorId); // Append creatorId to FormData
    formData.append("wordId", wordId); // Append wordId to FormData

    const data = await apiRequest(`${BASE_URL}/audio/`, {
      method: "POST",
      body: formData, // Send FormData as body
    });

    if (data && data.dbAudio.audioId) {
      await apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({ audioId: data.dbAudio.audioId }), // Update word with new audio ID
      });

      if (oldAudioId) {
        await apiRequest(`${BASE_URL}/audio/${oldAudioId}`, {
          method: "DELETE", // Delete old audio file
        });
      }
    }

    return data; // Return the response data
  };

  const setWordlistPractice = async ({
    userId,
    wordlistId,
    order,
    currentIndex,
  }) => {
    return apiRequest(`${BASE_URL}/user/set-wordlist-practice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ userId, wordlistId, order, currentIndex }), // Convert data to JSON string
    });
  };

  const getUsers = async ({ competitionCode }) => {
    return apiRequest(`${BASE_URL}/user/competition/${competitionCode}`, {
      method: "GET",
    });
  };

  const generateWordFrequency = async ({ word }) => {
    return apiRequest(`${BASE_URL}/tool/generate-difficulty-rating/${word}`, {
      method: "GET",
    });
  };

  const createUser = async ({ user }) => {
    return apiRequest(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      body: JSON.stringify({ uid: user.uid, email: user.email, role: "user" }), // Convert user data to JSON string
    });
  };

  const deleteTemplate = async ({ templateId }) => {
    return apiRequest(`${BASE_URL}/form/templates/${templateId}`, {
      method: "DELETE",
    });
  };

  const deleteFile = async ({ fileId }) => {
    return apiRequest(`${BASE_URL}/file/${fileId}`, { method: "DELETE" });
  };

  const deleteWord = async ({ wordId, audioId }) => {
    const data = await apiRequest(`${BASE_URL}/wordlist/word/${wordId}`, {
      method: "DELETE",
    });

    if (audioId) {
      await apiRequest(`${BASE_URL}/audio/${audioId}`, { method: "DELETE" }); // Delete associated audio file
    }

    return data; // Return the response data
  };

  const deleteWordlist = async ({ wordlistId }) => {
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

export default useApi; // Export the useApi hook
