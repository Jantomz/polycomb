import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useNavigate } from "react-router-dom";

const AdminEditSchedule = () => {
  const [events, setEvents] = useState([]);
  const { updateSchedule, getCompetition } = useApi();
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
        if (competition?.schedule) {
          setEvents(competition.schedule);
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        setError("Failed to fetch competition. Please try again later.");
      }
    };
    fetchCompetition();
  }, []);

  const addEvent = () => {
    const newEvents = [
      ...events,
      {
        name: "",
        description: "",
        startDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "",
        endDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "",
        startTime:
          events.length > 0 ? events[events.length - 1].endTime : "09:00",
        endTime:
          events.length > 0
            ? new Date(
                new Date(
                  `1970-01-01T${events[events.length - 1].endTime}Z`
                ).getTime() +
                  60 * 60 * 1000
              )
                .toISOString()
                .split("T")[1]
                .split("Z")[0]
            : "10:00",
      },
    ];
    setEvents(
      newEvents.sort(
        (a, b) =>
          new Date(`${a.startDate}T${a.startTime}`) -
          new Date(`${b.startDate}T${b.startTime}`)
      )
    );
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = events.map((event, i) =>
      i === index ? { ...event, [field]: value } : event
    );
    setEvents(
      newEvents.sort(
        (a, b) =>
          new Date(`${a.startDate}T${a.startTime}`) -
          new Date(`${b.startDate}T${b.startTime}`)
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(events);

    const submitSchedule = async () => {
      try {
        await updateSchedule({ code, schedule: events });
        navigate(`/competition/${code}`);
      } catch (err) {
        console.error("Failed to update schedule:", err);
        setError("Failed to update schedule. Please try again later.");
      }
    };

    submitSchedule();
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Schedule for {competition?.title}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}
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
            <input
              autoComplete="off"
              type="time"
              id={`event-${index}-startTime`}
              value={event.startTime}
              onChange={(e) =>
                handleEventChange(index, "startTime", e.target.value)
              }
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <input
              autoComplete="off"
              type="time"
              id={`event-${index}-endTime`}
              value={event.endTime}
              onChange={(e) =>
                handleEventChange(index, "endTime", e.target.value)
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

export default AdminEditSchedule;
