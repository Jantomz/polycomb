import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useEffect, useState } from "react";

const Form = ({ user }) => {
  const templateId = useParams().templateId;
  const { getTemplate, submitForm } = useApi();

  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const template = await getTemplate({ templateId });
        setTemplate(template);
      } catch (err) {
        console.error("Failed to fetch template:", err);
        setError("Failed to load the template. Please try again later.");
      }
    };
    fetchTemplate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== "signature")
    );

    try {
      await submitForm({
        templateId,
        answers: data,
        signature: e.target.signature.value,
        uid: user.uid,
      });
      navigate(`/competition/${template.competitionCode}`);
    } catch (err) {
      console.error("Failed to submit form:", err);
      setError("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Form</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {template && (
          <div>
            <h3 className="text-xl font-semibold text-yellow-700 mb-2">
              {template.title}
            </h3>
            <p className="text-yellow-600 mb-6">{template.description}</p>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-yellow-700 font-medium mb-1"
                  >
                    {field.name}
                  </label>
                  <input
                    autoComplete="off"
                    name={field.name}
                    type={field.type}
                    required={field.required}
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

export default Form;
