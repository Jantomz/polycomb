import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
    setError(null);
    try {
      const res = await createTemplate(formData);

      if (res) {
        alert("Template created successfully");
        navigate(`/competition/${competitionCode}`);
        setFormData({
          title: "",
          competitionCode: competitionCode,
          creatorId: user.uid,
          fields: [{ name: "", type: "text", required: false }],
        });
      } else {
        throw new Error("Unknown error occurred");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while creating the template");
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
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">New Template</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoComplete="off"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          value={formData.title}
          className="w-full p-2 border border-yellow-300 rounded"
        />
        {formData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <input
              autoComplete="off"
              placeholder="Field Name"
              required
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              value={field.name}
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <select
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              value={field.type}
              className="w-full p-2 border border-yellow-300 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                autoComplete="off"
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
                className="form-checkbox"
              />
              <span>Required</span>
            </label>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Field
            </button>
          </div>
        ))}
        <div className="flex justify-center m-auto gap-4">
          <button
            type="button"
            onClick={addField}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add Field
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewTemplate;
