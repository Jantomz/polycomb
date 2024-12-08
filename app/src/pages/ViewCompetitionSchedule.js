import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi.js";

const ViewCompetitionSchedule = () => {
  const { getCompetition } = useApi();
  const code = useParams().code;
  const [competition, setCompetition] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code: code });
        setCompetition(competition);
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        setError("Failed to fetch competition. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompetition();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
