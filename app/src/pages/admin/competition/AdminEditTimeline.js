import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditTimeline = () => {
  const [events, setEvents] = useState([]); // State to hold the list of events
  const { updateTimeline, getCompetition } = useApi(); // Custom hook to interact with API
  const { code } = useParams(); // Get competition code from URL parameters
  const [competition, setCompetition] = useState(null); // State to hold competition details
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code }); // Fetch competition details
        setCompetition(competition); // Set competition state
        if (competition?.timeline) {
          setEvents(competition.timeline); // Set events if timeline exists
        }
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        setError("Failed to fetch competition. Please try again later."); // Set error message
      }
    };
    fetchCompetition(); // Call the function to fetch competition details
  }, []);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        name: "",
        description: "",
        startDate: competition?.startDate || "", // Default start date to competition start date
        endDate: competition?.startDate || "", // Default end date to competition start date
      },
    ]);
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index)); // Remove event at specified index
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = events.map(
      (event, i) => (i === index ? { ...event, [field]: value } : event) // Update specific field of event
    );
    setEvents(newEvents); // Set updated events state
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const submitTimeline = async () => {
      try {
        await updateTimeline({ code, timeline: events }); // Update timeline via API
        navigate(`/competition/${code}`); // Navigate to competition page
      } catch (err) {
        console.error("Failed to update timeline:", err);
        setError("Failed to update timeline. Please try again later."); // Set error message
      }
    };
    submitTimeline(); // Call the function to submit timeline
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Edit Timeline for {competition?.title} {/* Display competition title */}
      </h1>
      {error && <p className="text-red-500">{error}</p>}{" "}
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
              Remove Event {/* Button to remove event */}
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-4 m-auto w-max">
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
            Save Timeline {/* Button to save the timeline */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditTimeline;
