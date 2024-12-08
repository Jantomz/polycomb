import { useParams } from "react-router-dom"; // Importing useParams hook to get URL parameters
import useApi from "../../../hooks/useApi.js"; // Custom hook to interact with API
import { useEffect, useState } from "react"; // Importing React hooks

const Form = ({ user }) => {
  const templateId = useParams().templateId; // Extracting templateId from URL parameters
  const { getTemplate, getTemplateForms } = useApi(); // Destructuring API methods from custom hook

  const [template, setTemplate] = useState(null); // State to store template data
  const [forms, setForms] = useState([]); // State to store forms data
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [error, setError] = useState(null); // State to store error messages

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term state on input change
  };

  const parseSearchTerm = (term) => {
    const andTerms = term.split(" AND ").map((t) => t.trim()); // Split search term by "AND" and trim spaces
    const orTerms = term.split(" OR ").map((t) => t.trim()); // Split search term by "OR" and trim spaces
    return { andTerms, orTerms }; // Return parsed terms
  };

  const filteredForms = forms.filter((form) => {
    const { andTerms, orTerms } = parseSearchTerm(searchTerm); // Parse search term into AND and OR terms

    const matchesAndTerms = andTerms.every((term) =>
      form.answers.some((answer) =>
        Object.values(answer).some(
          (value) => value.toLowerCase().includes(term.toLowerCase()) // Check if all AND terms match
        )
      )
    );

    const matchesOrTerms = orTerms.some((term) =>
      form.answers.some((answer) =>
        Object.values(answer).some(
          (value) => value.toLowerCase().includes(term.toLowerCase()) // Check if any OR term matches
        )
      )
    );

    return matchesAndTerms || matchesOrTerms; // Return true if either AND or OR terms match
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const template = await getTemplate({ templateId }); // Fetch template data from API
        setTemplate(template); // Update template state
      } catch (error) {
        console.error("Failed to fetch template:", error); // Log error to console
        setError("Failed to fetch template."); // Update error state
      }
    };

    const fetchForms = async () => {
      try {
        const forms = await getTemplateForms({ templateId }); // Fetch forms data from API
        setForms(forms); // Update forms state
      } catch (error) {
        console.error("Failed to fetch forms:", error); // Log error to console
        setError("Failed to fetch forms."); // Update error state
      }
    };

    fetchTemplate(); // Call fetchTemplate function
    fetchForms(); // Call fetchForms function
  }, [templateId]); // Dependency array to re-run effect when templateId changes

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Form Preview</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
      {/* Display error message if any */}
      {template && (
        <div className="mb-8">
          <h3 className="text-xl text-yellow-700">{template.title}</h3>{" "}
          {/* Display template title */}
          <p className="text-yellow-600 mb-4">{template.description}</p>{" "}
          {/* Display template description */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {template.fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label htmlFor={field.name} className="text-yellow-700">
                  {field.name}
                </label>
                <input
                  autoComplete="off"
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="p-2 border border-yellow-300 rounded"
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label htmlFor="signature" className="text-yellow-700">
                Signature
              </label>
              <input
                name="signature"
                type="text"
                required
                autoComplete="off"
                className="p-2 border border-yellow-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      <h1 className="text-2xl font-semibold text-yellow-600 mb-2">
        Form Responses ({forms.length}) {/* Display number of form responses */}
      </h1>
      <h2 className="text-xl text-yellow-700 mb-2">Search: </h2>
      <input
        autoComplete="off"
        type="text"
        value={searchTerm}
        onChange={handleSearch} // Update search term on input change
        placeholder="Search..."
        className="p-2 border border-yellow-300 rounded mb-4"
      />
      <div className="space-y-4 flex flex-wrap justify-center">
        {filteredForms.map((form) => (
          <div
            key={form._id}
            className="p-4 border border-yellow-300 rounded bg-yellow-100 w-[300px]"
          >
            <h3 className="text-xl text-yellow-700">Response: {form.title}</h3>{" "}
            {/* Display form response title */}
            {form.answers.map((answer) =>
              form.fields.map((field) => (
                <div
                  key={field.name}
                  className="flex justify-center mb-2 flex-wrap"
                >
                  <label htmlFor={field.name} className="text-yellow-700">
                    {field.name}-
                  </label>
                  <div className="text-yellow-600">{answer[field.name]}</div>{" "}
                  {/* Display form field answer */}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form; // Exporting Form component as default
