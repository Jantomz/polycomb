const Form = require("../models/formModel"); // Import Form model
const Template = require("../models/formTemplateModel"); // Import Template model
const mongoose = require("mongoose"); // Import mongoose for MongoDB interactions

// Fetch all templates, sorted by creation date in descending order
const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({}).sort({ createdAt: -1 });
    res.status(200).json(templates); // Return templates with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" }); // Handle errors
  }
};

// Fetch a single template by its ID
const getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.id });
    if (!template) {
      return res.status(404).json({ error: "Template not found" }); // Return 404 if not found
    }
    res.status(200).json(template); // Return template with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch template" }); // Handle errors
  }
};

// Create a new template
const createTemplate = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" }); // Validate request body
  }

  if (!req.body.fields || !Array.isArray(req.body.fields)) {
    return res
      .status(400)
      .json({ error: "Fields are missing or not an array" });
  }

  for (const field of req.body.fields) {
    if (!field.name || !field.type) {
      return res
        .status(400)
        .json({ error: "Each field must have a name and a type" });
    }
  }

  const allowedTypes = ["text", "email", "number", "date"];
  if (req.body.fields && Array.isArray(req.body.fields)) {
    for (const field of req.body.fields) {
      if (!allowedTypes.includes(field.type)) {
        return res
          .status(400)
          .json({ error: `Invalid field type: ${field.type}` });
      }
    }
  } else {
    return res
      .status(400)
      .json({ error: "Fields are missing or not an array" });
  }

  try {
    const template = new Template(req.body); // Create new template instance
    await template.save(); // Save template to database
    res.status(201).json(template); // Return created template with status 201
  } catch (error) {
    res.status(500).json({ error: "Failed to create template" }); // Handle errors
  }
};

// Fetch all forms, sorted by creation date in descending order
const getForms = async (req, res) => {
  try {
    const forms = await Form.find({}).sort({ createdAt: -1 });
    res.status(200).json(forms); // Return forms with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" }); // Handle errors
  }
};

// Fetch a single form by its ID
const getForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: mongoose.Types.ObjectId(req.params.id), // Convert string ID to ObjectId
    });
    if (!form) {
      return res.status(404).json({ error: "Form not found" }); // Return 404 if not found
    }
    res.status(200).json(form); // Return form with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" }); // Handle errors
  }
};

// Fetch templates by competition code
const getTemplatesByCompetitionCode = async (req, res) => {
  try {
    const templates = await Template.find({
      competitionCode: req.params.competitionCode, // Filter by competition code
    });
    if (!templates) {
      return res.status(404).json({ error: "Templates not found" }); // Return 404 if not found
    }
    res.status(200).json(templates); // Return templates with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" }); // Handle errors
  }
};

// Create a new form
const createForm = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" }); // Validate request body
  }

  try {
    const form = new Form(req.body); // Create new form instance
    await form.save(); // Save form to database
    res.status(201).json(form); // Return created form with status 201
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" }); // Handle errors
  }
};

// Fetch forms created by a specific user for a specific competition
const getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({
      creatorId: req.params.userId, // Filter by user ID
      competitionCode: req.params.competitionCode, // Filter by competition code
    });
    if (!forms) {
      return res.status(404).json({ error: "Forms not found" }); // Return 404 if not found
    }
    res.status(200).json(forms); // Return forms with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" }); // Handle errors
  }
};

// Fetch forms associated with a specific template
const getTemplateForms = async (req, res) => {
  try {
    const forms = await Form.find({ templateId: req.params.templateId }); // Filter by template ID
    if (!forms) {
      return res.status(404).json({ error: "Forms not found" }); // Return 404 if not found
    }
    res.status(200).json(forms); // Return forms with status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" }); // Handle errors
  }
};

// Delete a template and all associated forms
const deleteTemplate = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Template not found" }); // Validate ObjectId
  }

  try {
    await Template.findByIdAndDelete(id); // Delete template by ID
    await Form.deleteMany({ templateId: id }); // Delete all forms associated with the template
    res
      .status(200)
      .json({ message: "Template and forms deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ error: "Failed to delete template and forms" }); // Handle errors
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplate,
  getTemplatesByCompetitionCode,
  createForm,
  getForms,
  getForm,
  getUserForms,
  getTemplateForms,
  deleteTemplate,
};
