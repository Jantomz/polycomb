import { useEffect, useState } from "react"; // Importing hooks from React
import { useParams } from "react-router-dom"; // Importing useParams to get URL parameters
import useApi from "../hooks/useApi.js"; // Custom hook to interact with the API

const ViewCompetitionSchedule = () => {
  const { getCompetition } = useApi(); // Destructuring getCompetition function from useApi hook
  const { code } = useParams(); // Extracting 'code' parameter from the URL
  const [competition, setCompetition] = useState({}); // State to store competition data
  const [error, setError] = useState(null); // State to store error messages
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const competition = await getCompetition({ code }); // Fetching competition data using the code from URL
        setCompetition(competition); // Updating state with fetched competition data
      } catch (err) {
        console.error("Failed to fetch competition:", err); // Logging error to console
        setError("Failed to fetch competition. Please try again later."); // Setting error message
      } finally {
        setLoading(false); // Setting loading to false after fetch attempt
      }
    };
    fetchCompetition(); // Calling the fetch function
  }, [code, getCompetition]); // Dependencies array for useEffect

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>; // Display loading message
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>; // Display error message
  }

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        Schedule for {competition.title} {/* Display competition title */}
      </h3>
      {competition?.schedule?.length > 0 ? ( // Check if schedule exists and has events
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Event Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Start Time</th>
                <th className="py-2 px-4 border-b">End Time</th>
              </tr>
            </thead>
            <tbody>
              {competition.schedule.map((event) => (
                <tr key={event.name}>
                  {" "}
                  {/* Unique key for each event */}
                  <td className="py-2 px-4 border-b">{event.name}</td>
                  <td className="py-2 px-4 border-b">{event.description}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(event.startDate).toLocaleDateString()}{" "}
                    {/* Format start date */}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {event.startDate !== event.endDate
                      ? new Date(event.endDate).toLocaleDateString() // Format end date if different from start date
                      : "Same as start date"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(
                      `1970-01-01T${event.startTime}Z`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}{" "}
                    {/* Format start time */}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {event.startTime !== event.endTime
                      ? new Date(
                          `1970-01-01T${event.endTime}Z`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        }) // Format end time if different from start time
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">Nothing here!</p> // Display message if no events
      )}
    </section>
  );
};

export default ViewCompetitionSchedule; // Exporting the component as default
