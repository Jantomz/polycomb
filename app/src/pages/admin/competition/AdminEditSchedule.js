import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminEditSchedule = () => {
  const [events, setEvents] = useState([]);
  const { updateSchedule, getCompetition } = useApi();
  const { code } = useParams();
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code });
      console.log(competition);
      setCompetition(competition);
      if (competition?.schedule) {
        setEvents(competition.schedule);
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
    updateSchedule({ code, schedule: events });
  };

  return (
    <div>
      <h1>Edit Schedule for {competition?.title}</h1>
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
            <input
              type="time"
              id={`event-${index}-startTime`}
              value={event.startTime}
              onChange={(e) =>
                handleEventChange(index, "startTime", e.target.value)
              }
            />
            <input
              type="time"
              id={`event-${index}-endTime`}
              value={event.endTime}
              onChange={(e) =>
                handleEventChange(index, "endTime", e.target.value)
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
        <button type="submit">Save Schedule</button>
      </form>
    </div>
  );
};

export default AdminEditSchedule;
