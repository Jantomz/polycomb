import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi.js";

const AdminNewTemplate = ({ user }) => {
  const { createTemplate } = useApi(); // Custom hook to interact with API
  const competitionCode = useParams().code; // Get competition code from URL parameters
  const [formData, setFormData] = useState({
    title: "",
    competitionCode: competitionCode, // Initialize with competition code
    creatorId: user.uid, // Set creator ID from user prop
    fields: [{ name: "", type: "text", required: false }], // Default field structure
  });
  const [error, setError] = useState(null); // State to handle errors

  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update form data dynamically based on input name
    });
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...formData.fields];
    newFields[index][field] = value; // Update specific field in fields array
    setFormData({
      ...formData,
      fields: newFields, // Set updated fields array in form data
    });
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { name: "", type: "text", required: false }], // Add new empty field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await createTemplate(formData); // Call API to create template

      if (res) {
        alert("Template created successfully");
        navigate(`/competition/${competitionCode}`); // Navigate to competition page on success
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
      setError(err.message || "An error occurred while creating the template"); // Set error message
    }
  };

  const removeField = (index) => {
    const newFields = formData.fields.filter((_, i) => i !== index); // Remove field by index
    setFormData({
      ...formData,
      fields: newFields, // Update form data with new fields array
    });
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">New Template</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
      {/* Display error if exists */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoComplete="off"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          value={formData.title} // Bind input value to form data
          className="w-full p-2 border border-yellow-300 rounded"
        />
        {formData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <input
              autoComplete="off"
              placeholder="Field Name"
              required
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              value={field.name} // Bind input value to field name
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <select
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              value={field.type} // Bind select value to field type
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
                checked={field.required} // Bind checkbox to field required status
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
                className="form-checkbox"
              />
              <span>Required</span>
            </label>
            <button
              type="button"
              onClick={() => removeField(index)} // Remove field on button click
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Field
            </button>
          </div>
        ))}
        <div className="flex justify-center m-auto gap-4">
          <button
            type="button"
            onClick={addField} // Add new field on button click
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
