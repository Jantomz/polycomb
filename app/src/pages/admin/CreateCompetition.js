import useApi from "../../hooks/useApi.js";

import { useNavigate } from "react-router-dom";

const CreateCompetition = ({ user, userData, setUserData }) => {
  const navigate = useNavigate();
  const { createCompetition, addCompetition, createTemplate } = useApi();
  const handleCreate = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const startDate = e.target.startDate.value;
    const endDate = e.target.endDate.value;
    const startTemplate = e.target.startTemplate.checked;

    // will need to solve this, can't be random like this, has chance of doubling up on itself
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const admins = [user.uid];

    console.log(title, description, startDate, endDate, code, admins);

    // Call the createCompetition function from useApi
    const res = await createCompetition(
      title,
      description,
      code,
      startDate,
      endDate,
      admins
    );

    console.log(res);

    if (startTemplate) {
      const templateRes = await createTemplate({
        title: "General Information Form",
        competitionCode: res.code,
        creatorId: user.uid,
        fields: [
          {
            name: "Name",
            type: "text",
            required: true,
          },
          {
            name: "Email",
            type: "email",
            required: true,
          },
          {
            name: "Birthdate",
            type: "date",
            required: true,
          },
          {
            name: "School",
            type: "text",
            required: true,
          },
          {
            name: "Grade",
            type: "number",
            required: true,
          },
        ],
      });

      console.log("Template created: ", templateRes);
    }

    // Call the addCompetition function from useApi
    // Pass the competition ID and the user ID
    if (res) {
      console.log("User Id: ", user.uid);
      console.log("Competition Code: ", res.code);
      const res2 = await addCompetition({
        code: res.code,
        userId: user.uid,
      });

      console.log(res2);
      setUserData(res2);
    }

    // Redirect the user to the admin dashboard
    navigate("/");
  };

  return (
    <div>
      <h1>Create Competition</h1>

      <form onSubmit={(e) => handleCreate(e)}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />

        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" required />

        <label htmlFor="startDate">Start Date</label>
        <input type="date" id="startDate" name="startDate" required />

        <label htmlFor="endDate">End Date</label>
        <input type="date" id="endDate" name="endDate" required />

        {/* <label htmlFor="admins">Admins</label>
        <input type="text" id="admins" name="admins" value={user.uid} disabled /> */}

        <label htmlFor="startTemplate">
          Start with Default Information Form?
        </label>
        <input type="checkbox" id="startTemplate" name="startTemplate" />

        <button type="submit">Create Competition</button>
      </form>
    </div>
  );
};

export default CreateCompetition;
