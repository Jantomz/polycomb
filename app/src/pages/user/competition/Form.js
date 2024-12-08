import { useParams, useNavigate } from "react-router-dom"; // Import hooks for routing
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls
import { useEffect, useState } from "react"; // Import React hooks

const Form = ({ user }) => {
  const templateId = useParams().templateId; // Get templateId from URL parameters
  const { getTemplate, submitForm } = useApi(); // Destructure API functions from custom hook

  const navigate = useNavigate(); // Hook for navigation

  const [template, setTemplate] = useState(null); // State to store template data
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const template = await getTemplate({ templateId }); // Fetch template data from API
        setTemplate(template); // Set template state with fetched data
      } catch (err) {
        console.error("Failed to fetch template:", err); // Log error to console
        setError("Failed to load the template. Please try again later."); // Set error message
      }
    };
    fetchTemplate(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target); // Create FormData object from form
    const data = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== "signature") // Convert FormData to object, excluding signature
    );

    try {
      await submitForm({
        templateId,
        answers: data, // Form answers
        signature: e.target.signature.value, // User's signature
        uid: user.uid, // User ID
      });
      navigate(`/competition/${template.competitionCode}`); // Navigate to competition page
    } catch (err) {
      console.error("Failed to submit form:", err); // Log error to console
      setError("Failed to submit the form. Please try again later."); // Set error message
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Form</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
        {/* Display error message if any */}
        {template && (
          <div>
            <h3 className="text-xl font-semibold text-yellow-700 mb-2">
              {template.title} {/* Display template title */}
            </h3>
            <p className="text-yellow-600 mb-6">{template.description}</p>{" "}
            {/* Display template description */}
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-yellow-700 font-medium mb-1"
                  >
                    {field.name} {/* Display field name */}
                  </label>
                  <input
                    autoComplete="off"
                    name={field.name}
                    type={field.type} // Input type based on field type
                    required={field.required} // Set required attribute if field is required
                    className="border border-yellow-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              ))}
              <div className="flex flex-col">
                <label
                  htmlFor="signature"
                  className="text-yellow-700 font-medium mb-1"
                >
                  Signature
                </label>
                <input
                  autoComplete="off"
                  name="signature"
                  type="text"
                  required
                  className="border border-yellow-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form; // Export the Form component
