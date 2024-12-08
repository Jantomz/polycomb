import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditTimeline = () => {
  const [events, setEvents] = useState([]);
  const { updateTimeline, getCompetition } = useApi();
  const { code } = useParams();
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code });
      console.log(competition);
      setCompetition(competition);
      if (competition?.timeline) {
        setEvents(competition.timeline);
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
        startDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "",
        endDate: competition?.startDate
          ? new Date(competition.startDate).toISOString().split("T")[0]
          : "",
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
    updateTimeline({ code, timeline: events });
  };

  return (
    <div>
      <h1>Edit Timeline for {competition?.title}</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        {events.map((event, index) => (
          <div key={index}>
            <label htmlFor={`event-${index}-name`}>Event {index + 1}</label>
            <input
              type="text"
              id={`event-${index}-name`}
              value={event.name}
              onChange={(e) => handleEventChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              id={`event-${index}-description`}
              value={event.description}
              onChange={(e) =>
                handleEventChange(index, "description", e.target.value)
              }
            />
            <input
              type="date"
              id={`event-${index}-startDate`}
              value={event.startDate}
              onChange={(e) =>
                handleEventChange(index, "startDate", e.target.value)
              }
            />
            <input
              type="date"
              id={`event-${index}-endDate`}
              value={event.endDate}
              onChange={(e) =>
                handleEventChange(index, "endDate", e.target.value)
              }
            />
            <button onClick={() => removeEvent(index)} type="button">
              Remove Event
            </button>
          </div>
        ))}
        <button onClick={addEvent} type="button">
          Add Event
        </button>
        <button type="submit">Save Timeline</button>
      </form>
    </div>
  );
};

export default AdminEditTimeline;
