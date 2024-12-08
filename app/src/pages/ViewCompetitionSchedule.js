import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi.js";

const ViewCompetitionSchedule = () => {
  const { getCompetition } = useApi();
  const code = useParams().code;
  const [competition, setCompetition] = useState({});

  useEffect(() => {
    const fetchCompetition = async () => {
      const competition = await getCompetition({ code: code });
      console.log(competition);
      setCompetition(competition);
    };
    fetchCompetition();
  }, []);
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-2">
        Schedule for {competition.title}
      </h3>
      {competition &&
      competition.schedule &&
      competition.schedule.length > 0 ? (
        competition.schedule.map((event) => (
          <div key={event.name} className="mb-4 p-4 bg-yellow-100 rounded">
            <h4 className="text-xl font-semibold">{event.name}</h4>
            <p>{event.description}</p>
            <p>{new Date(event.startDate).toLocaleDateString()}</p>
            {event.startDate !== event.endDate && (
              <p>{new Date(event.endDate).toLocaleDateString()}</p>
            )}
            <p>{event.startTime}</p>
            {event.startTime !== event.endTime && <p>{event.endTime}</p>}
          </div>
        ))
      ) : (
        <p>Nothing here!</p>
      )}
    </section>
  );
};

export default ViewCompetitionSchedule;
