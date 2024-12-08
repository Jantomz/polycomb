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
    <div>
      <h1>Form {templateId}</h1>
      {template && (
        <div>
          <h1>Form Preview</h1>
          <h3>{template.title}</h3>
          <p>{template.description}</p>
          <form onSubmit={(e) => e.preventDefault()}>
            {template.fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.name}</label>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                />
              </div>
            ))}
            <label htmlFor="signature">Signature</label>
            <input name="signature" type="text" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <h1>Form Responses</h1>
      <h2>Search: </h2>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
      />

      <div>
        {filteredForms.map((form) => (
          <div
            key={form._id}
            style={{
              border: "1px solid black",
            }}
          >
            <h3>{form.title}</h3>
            {form.answers.map((answer) =>
              form.fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name}>{field.name}</label>
                  <div>{answer[field.name]}</div>
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
