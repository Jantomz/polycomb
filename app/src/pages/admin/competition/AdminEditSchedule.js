import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useNavigate } from "react-router-dom";

const AdminEditSchedule = () => {
  const [events, setEvents] = useState([]); // State to hold the list of events
  const { updateSchedule, getCompetition } = useApi(); // Custom hook to interact with API
  const { code } = useParams(); // Get competition code from URL parameters
  const [competition, setCompetition] = useState(null); // State to hold competition details
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code }); // Fetch competition details
        setCompetition(competition); // Set competition state
        if (competition?.schedule) {
          setEvents(competition.schedule); // Set events if schedule exists
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err); // Log error to console
        setError("Failed to fetch competition. Please try again later."); // Set error message
      }
    };
    fetchCompetition(); // Call the function to fetch competition details
  }, []);

  const addEvent = () => {
    const newEvents = [
      ...events,
      {
        name: "",
        description: "",
        startDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "", // Default start date to competition start date
        endDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "", // Default end date to competition start date
        startTime:
          events.length > 0 ? events[events.length - 1].endTime : "09:00", // Default start time to last event's end time
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
            : "10:00", // Default end time to one hour after start time
      },
    ];
    setEvents(
      newEvents.sort(
        (a, b) =>
          new Date(`${a.startDate}T${a.startTime}`) -
          new Date(`${b.startDate}T${b.startTime}`)
      )
    ); // Sort events by start date and time
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index)); // Remove event by index
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = events.map((event, i) =>
      i === index ? { ...event, [field]: value } : event
    ); // Update event field by index
    setEvents(
      newEvents.sort(
        (a, b) =>
          new Date(`${a.startDate}T${a.startTime}`) -
          new Date(`${b.startDate}T${b.startTime}`)
      )
    ); // Sort events by start date and time
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const submitSchedule = async () => {
      try {
        await updateSchedule({ code, schedule: events }); // Update schedule via API
        navigate(`/competition/${code}`); // Navigate to competition page
      } catch (err) {
        console.error("Failed to update schedule:", err); // Log error to console
        setError("Failed to update schedule. Please try again later."); // Set error message
      }
    };

    submitSchedule(); // Call the function to submit schedule
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Schedule for {competition?.title} {/* Display competition title */}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}{" "}
      {/* Display error message if any */}
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
              Event {index + 1} {/* Display event number */}
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
            <div className="flex flex-col md:flex-row gap-4">
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
            </div>
            <div className="flex flex-col md:flex-row gap-4">
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
            </div>
            <button
              onClick={() => removeEvent(index)}
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Event {/* Button to remove event */}
            </button>
          </div>
        ))}
        <div className="flex flex-col md:flex-row gap-4 m-auto w-max">
          <button
            onClick={addEvent}
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add Event {/* Button to add new event */}
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Schedule {/* Button to save schedule */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditSchedule;
