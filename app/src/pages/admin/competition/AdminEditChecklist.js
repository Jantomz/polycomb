import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const { updateChecklist, getCompetition, getCompetitionTemplates } = useApi();
  const { code } = useParams();
  const [competition, setCompetition] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code });
      console.log(competition);
      setCompetition(competition);
      if (competition?.checklist) {
        setTasks(competition.checklist);
      }
    };
    fetchCompetition();

    const fetchForms = async () => {
      const forms = await getCompetitionTemplates({ competitionCode: code });
      console.log("Condition to complete: ", forms);
      setTemplates(forms);
      setConditions(
        forms.map((form) => `COMPLETE ${form.title} (${form._id})`)
      );
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
    updateChecklist({ code, checklist: tasks });
  };

  return (
    <div>
      <h1>Edit Checklist for {competition?.title}</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        {tasks.map((task, index) => (
          <div key={index}>
            <label htmlFor={`task-${index}-name`}>Task {index + 1}</label>
            <input
              type="text"
              id={`task-${index}-name`}
              value={task.name}
              onChange={(e) => handleEventChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              id={`task-${index}-description`}
              value={task.description}
              onChange={(e) =>
                handleEventChange(index, "description", e.target.value)
              }
            />
            <input
              type="date"
              id={`task-${index}-dueDate`}
              value={task.dueDate}
              onChange={(e) =>
                handleEventChange(index, "dueDate", e.target.value)
              }
            />
            <select
              value={task.condition}
              onChange={(e) =>
                handleEventChange(index, "condition", e.target.value)
              }
            >
              {/* TODO: Backend, need to ensure the option is valid */}
              <option value="">None</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>

            <button onClick={() => removeEvent(index)} type="button">
              Remove Task
            </button>
          </div>
        ))}
        <button onClick={addEvent} type="button">
          Add Task
        </button>
        <button type="submit">Save Checklist</button>
      </form>
    </div>
  );
};

export default AdminEditChecklist;
