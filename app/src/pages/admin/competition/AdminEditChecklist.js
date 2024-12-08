import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const { updateChecklist, getCompetition, getCompetitionTemplates } = useApi();
  const { code } = useParams();
  const [competition, setCompetition] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code });
        console.log(competition);
        setCompetition(competition);
        if (competition?.checklist) {
          setTasks(competition.checklist);
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        setError("Failed to fetch competition. Please try again later.");
      }
    };
    fetchCompetition();

    const fetchForms = async () => {
      try {
        const forms = await getCompetitionTemplates({ competitionCode: code });
        console.log("Condition to complete: ", forms);
        setTemplates(forms);
        setConditions(
          forms.map((form) => `COMPLETE ${form.title} (${form._id})`)
        );
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setError("Failed to fetch forms. Please try again later.");
      }
    };

    fetchForms();
  }, []);

  const addEvent = () => {
    setTasks([
      ...tasks,
      {
        name: "",
        description: "",
        dueDate: competition?.startDate,
        condition: "",
      },
    ]);
  };

  const removeEvent = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = tasks.map((event, i) =>
      i === index ? { ...event, [field]: value } : event
    );
    setTasks(newEvents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(tasks);

    const submitChecklist = async () => {
      try {
        await updateChecklist({ code, checklist: tasks });
        navigate(`/competition/${code}`);
      } catch (err) {
        console.error("Failed to update checklist:", err);
        setError("Failed to update checklist. Please try again later.");
      }
    };

    submitChecklist();
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Checklist for {competition?.title}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
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
              Task {index + 1}
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
                  {condition}
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
        <div className="flex gap-4 m-auto w-max">
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

export default AdminEditChecklist;
