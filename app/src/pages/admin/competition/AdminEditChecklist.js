import { useEffect, useState } from "react"; // Importing hooks from React
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks from react-router-dom for routing
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls

const AdminEditChecklist = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const { updateChecklist, getCompetition, getCompetitionTemplates } = useApi(); // Destructuring API functions from custom hook
  const { code } = useParams(); // Getting competition code from URL parameters
  const [competition, setCompetition] = useState(null); // State to store competition details
  const [conditions, setConditions] = useState([]); // State to store conditions for tasks
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code }); // Fetch competition details using API
        setCompetition(competition); // Set competition state
        if (competition?.checklist) {
          setTasks(competition.checklist); // Set tasks if checklist exists
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err); // Log error to console
        setError("Failed to fetch competition. Please try again later."); // Set error message
      }
    };
    fetchCompetition(); // Call fetchCompetition function

    const fetchForms = async () => {
      try {
        const forms = await getCompetitionTemplates({ competitionCode: code }); // Fetch competition templates
        setConditions(
          forms.map((form) => `COMPLETE ${form.title} (${form._id})`) // Map forms to conditions
        );
      } catch (err) {
        console.error("Failed to fetch forms:", err); // Log error to console
        setError("Failed to fetch forms. Please try again later."); // Set error message
      }
    };

    fetchForms(); // Call fetchForms function
  }, []); // Empty dependency array to run effect only once

  const addEvent = () => {
    setTasks([
      ...tasks,
      {
        name: "",
        description: "",
        dueDate: competition?.startDate, // Default due date to competition start date
        condition: "",
      },
    ]);
  };

  const removeEvent = (index) => {
    setTasks(tasks.filter((_, i) => i !== index)); // Remove task by index
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = tasks.map(
      (event, i) => (i === index ? { ...event, [field]: value } : event) // Update task field by index
    );
    setTasks(newEvents); // Set updated tasks
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const submitChecklist = async () => {
      try {
        await updateChecklist({ code, checklist: tasks }); // Update checklist using API
        navigate(`/competition/${code}`); // Navigate to competition page
      } catch (err) {
        console.error("Failed to update checklist:", err); // Log error to console
        setError("Failed to update checklist. Please try again later."); // Set error message
      }
    };

    submitChecklist(); // Call submitChecklist function
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Checklist for {competition?.title}{" "}
        {/* Display competition title */}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div> // Display error message if exists
      )}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md space-y-4"
          >
            <label
              htmlFor={`task-${index}-name`}
              className="block text-yellow-700 font-semibold"
            >
              Task {index + 1} {/* Display task number */}
            </label>
            <input
              autoComplete="off"
              type="text"
              id={`task-${index}-name`}
              value={task.name}
              onChange={(e) => handleEventChange(index, "name", e.target.value)}
              className="w-full p-2 border border-yellow-300 rounded"
              placeholder="Task Name"
              required
            />
            <input
              autoComplete="off"
              type="text"
              id={`task-${index}-description`}
              value={task.description}
              onChange={(e) =>
                handleEventChange(index, "description", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
              placeholder="Task Description"
              required
            />
            <label
              htmlFor={`task-${index}-dueDate`}
              className="block text-yellow-700 font-semibold"
            >
              Due Date
            </label>
            <input
              autoComplete="off"
              type="date"
              id={`task-${index}-dueDate`}
              value={task.dueDate}
              onChange={(e) =>
                handleEventChange(index, "dueDate", e.target.value)
              }
              required
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <label
              htmlFor={`task-${index}-condition`}
              className="block text-yellow-700 font-semibold"
            >
              Condition to Complete
            </label>
            <select
              autoComplete="off"
              value={task.condition}
              onChange={(e) =>
                handleEventChange(index, "condition", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
            >
              <option value="">None</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition} {/* Display condition options */}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeEvent(index)}
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Task
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-4 m-auto w-max">
          <button
            onClick={addEvent}
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add Task
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Checklist
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditChecklist; // Exporting component as default
