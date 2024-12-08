import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useEffect, useState } from "react";

const Form = ({ user }) => {
  const templateId = useParams().templateId;
  const { getTemplate, getTemplateForms } = useApi();

  const [template, setTemplate] = useState(null);

  const [forms, setForms] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const parseSearchTerm = (term) => {
    const andTerms = term.split(" AND ").map((t) => t.trim());
    const orTerms = term.split(" OR ").map((t) => t.trim());
    return { andTerms, orTerms };
  };

  const filteredForms = forms.filter((form) => {
    const { andTerms, orTerms } = parseSearchTerm(searchTerm);

    const matchesAndTerms = andTerms.every((term) =>
      form.answers.some((answer) =>
        Object.values(answer).some((value) =>
          value.toLowerCase().includes(term.toLowerCase())
        )
      )
    );

    const matchesOrTerms = orTerms.some((term) =>
      form.answers.some((answer) =>
        Object.values(answer).some((value) =>
          value.toLowerCase().includes(term.toLowerCase())
        )
      )
    );

    return matchesAndTerms || matchesOrTerms;
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      const template = await getTemplate({ templateId });
      console.log(template);
      setTemplate(template);
    };
    fetchTemplate();

    const fetchForms = async () => {
      const forms = await getTemplateForms({ templateId });
      console.log(forms);
      setForms(forms);
    };
    fetchForms();
  }, []);

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">
        Form {templateId}
      </h1>
      {template && (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-yellow-600 mb-2">
            Form Preview
          </h1>
          <h3 className="text-xl text-yellow-700">{template.title}</h3>
          <p className="text-yellow-600 mb-4">{template.description}</p>
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
        Form Responses ({forms.length})
      </h1>
      <h2 className="text-xl text-yellow-700 mb-2">Search: </h2>

      <input
        autoComplete="off"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
        className="p-2 border border-yellow-300 rounded mb-4"
      />

      <div className="space-y-4 flex flex-wrap justify-center">
        {filteredForms.map((form) => (
          <div
            key={form._id}
            className="p-4 border border-yellow-300 rounded bg-yellow-100 w-[300px]"
          >
            <h3 className="text-xl text-yellow-700">Response: {form.title}</h3>
            {form.answers.map((answer) =>
              form.fields.map((field) => (
                <div
                  key={field.name}
                  className="flex justify-center mb-2 flex-wrap"
                >
                  <label htmlFor={field.name} className="text-yellow-700">
                    {field.name}-
                  </label>

                  <div className="text-yellow-600">{answer[field.name]}</div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
