import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";
import { useEffect, useState } from "react";

const Form = ({ user }) => {
  const templateId = useParams().templateId;
  const { getTemplate, submitForm } = useApi();

  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      const template = await getTemplate({ templateId });
      console.log(template);
      setTemplate(template);
    };
    fetchTemplate();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== "signature")
    );
    console.log(data);
    const form = submitForm({
      templateId,
      answers: data,
      signature: e.target.signature.value,
      uid: user.uid,
    });

    console.log(form);
    navigate(`/competition/${template.competitionCode}`);
  };

  return (
    <div>
      <h1>Form {templateId}</h1>
      {template && (
        <div>
          <h3>{template.title}</h3>
          <p>{template.description}</p>
          <form onSubmit={(e) => handleSubmit(e)}>
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
    </div>
  );
};

export default Form;
