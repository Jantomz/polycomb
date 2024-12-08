import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditTimeline = () => {
  const [events, setEvents] = useState([]);
  const { updateTimeline, getCompetition } = useApi();
  const { code } = useParams();
  const [competition, setCompetition] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code });
        console.log(competition);
        setCompetition(competition);
        if (competition?.timeline) {
          setEvents(competition.timeline);
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        setError("Failed to fetch competition. Please try again later.");
      }
    };
    fetchCompetition();
  }, []);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        name: "",
        description: "",
        startDate: competition?.startDate || "",
        endDate: competition?.startDate || "",
      },
    ]);
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = events.map((event, i) =>
      i === index ? { ...event, [field]: value } : event
    );
    setEvents(newEvents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(events);
    const submitTimeline = async () => {
      try {
        await updateTimeline({ code, timeline: events });
        navigate(`/competition/${code}`);
      } catch (err) {
        console.error("Failed to update timeline:", err);
        setError("Failed to update timeline. Please try again later.");
      }
    };
    submitTimeline();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Edit Timeline for {competition?.title}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md space-y-4"
          >
            <label
              htmlFor={`event-${index}-name`}
              className="block text-yellow-700 font-semibold"
            >
              Event {index + 1}
            </label>
            <input
              autoComplete="off"
              type="text"
              id={`event-${index}-name`}
              value={event.name}
              onChange={(e) => handleEventChange(index, "name", e.target.value)}
              className="w-full p-2 border border-yellow-300 rounded"
              placeholder="Event Name"
              required
            />
            <input
              autoComplete="off"
              type="text"
              id={`event-${index}-description`}
              value={event.description}
              onChange={(e) =>
                handleEventChange(index, "description", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
              placeholder="Event Description"
              required
            />
            <input
              autoComplete="off"
              type="date"
              id={`event-${index}-startDate`}
              value={event.startDate}
              onChange={(e) =>
                handleEventChange(index, "startDate", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <input
              autoComplete="off"
              type="date"
              id={`event-${index}-endDate`}
              value={event.endDate}
              onChange={(e) =>
                handleEventChange(index, "endDate", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <button
              onClick={() => removeEvent(index)}
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Event
            </button>
          </div>
        ))}
        <div className="flex gap-4 m-auto w-max">
          <button
            onClick={addEvent}
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add Event
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditTimeline;
