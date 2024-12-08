import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminNewTemplate = ({ user }) => {
  const { createTemplate } = useApi();
  const competitionCode = useParams().code;
  const [formData, setFormData] = useState({
    title: "",
    competitionCode: competitionCode,
    creatorId: user.uid,
    fields: [{ name: "", type: "text", required: false }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...formData.fields];
    newFields[index][field] = value;
    setFormData({
      ...formData,
      fields: newFields,
    });
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { name: "", type: "text", required: false }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createTemplate(formData);

    console.log(res);

    if (res) {
      alert("Template created successfully");
      setFormData({
        title: "",
        competitionCode: competitionCode,
        creatorId: user.uid,
        fields: [{ name: "", type: "text", required: false }],
      });
    } else {
      alert("Error creating template");
    }
  };

  const removeField = (index) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      fields: newFields,
    });
  };

  return (
    <div>
      <h1>New Template</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          value={formData.title}
        />
        {formData.fields.map((field, index) => (
          <div key={index}>
            <input
              placeholder="Field Name"
              required
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              value={field.name}
            />
            <select
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              value={field.type}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
              />
              Required
            </label>
            <button type="button" onClick={() => removeField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addField}>
          Add Field
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminNewTemplate;
