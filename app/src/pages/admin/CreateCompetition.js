import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi.js";
import { useNavigate } from "react-router-dom";

const CreateCompetition = ({ user, setUserData }) => {
  const navigate = useNavigate();
  const { createCompetition, addCompetition, createTemplate } = useApi();
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let newErrors = {};
    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required.";
    }
    if (new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "Start date cannot be after end date.";
    }
    setErrors(newErrors);
  }, [startDate, endDate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const startTemplate = e.target.startTemplate.checked;

    let newErrors = {};
    if (!title) {
      newErrors.title = "Title is required.";
    }
    if (!description) {
      newErrors.description = "Description is required.";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required.";
    }
    if (new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "Start date cannot be after end date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const admins = [user.uid];

    try {
      const res = await createCompetition(
        title,
        description,
        code,
        startDate,
        endDate,
        admins
      );

      if (startTemplate) {
        const templateRes = await createTemplate({
          title: "General Information Form",
          competitionCode: res.code,
          creatorId: user.uid,
          fields: [
            { name: "Name", type: "text", required: true },
            { name: "Email", type: "email", required: true },
            { name: "Birthdate", type: "date", required: true },
            { name: "School", type: "text", required: true },
            { name: "Grade", type: "number", required: true },
          ],
        });

        console.log("Template created: ", templateRes);
      }

      if (res) {
        const res2 = await addCompetition({
          code: res.code,
          userId: user.uid,
        });

        setUserData(res2);
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating competition: ", error);
      setErrors({
        api: "An error occurred while creating the competition. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <h1 className="text-4xl font-bold text-yellow-800 mb-8">
        Create Competition
      </h1>

      <form
        onSubmit={(e) => handleCreate(e)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-yellow-800 font-semibold mb-2"
          >
            Title
          </label>
          <input
            autoComplete="off"
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border border-yellow-300 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-yellow-800 font-semibold mb-2"
          >
            Description
          </label>
          <input
            autoComplete="off"
            type="text"
            id="description"
            name="description"
            required
            className="w-full p-2 border border-yellow-300 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-yellow-800 font-semibold mb-2"
          >
            Start Date
          </label>
          <input
            autoComplete="off"
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-2 border border-yellow-300 rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-yellow-800 font-semibold mb-2"
          >
            End Date
          </label>
          <input
            autoComplete="off"
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-2 border border-yellow-300 rounded"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="startTemplate"
            name="startTemplate"
            className="mr-2"
          />
          <label
            htmlFor="startTemplate"
            className="text-yellow-800 font-semibold"
          >
            Start with Default Information Form?
          </label>
        </div>

        {errors.api && (
          <p className="text-red-500 text-sm mb-4">{errors.api}</p>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
        >
          Create Competition
        </button>
      </form>
    </div>
  );
};

export default CreateCompetition;
