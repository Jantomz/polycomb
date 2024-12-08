const Form = require("../models/formModel");
const Template = require("../models/formTemplateModel");
const mongoose = require("mongoose");

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({}).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

const getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.id });
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch template" });
  }
};

const createTemplate = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: "Failed to create template" });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find({}).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};

const getForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

const getTemplatesByCompetitionCode = async (req, res) => {
  try {
    const templates = await Template.find({
      competitionCode: req.params.competitionCode,
    });
    if (!templates) {
      return res.status(404).json({ error: "Templates not found" });
    }
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

const createForm = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
};

const getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({
      creatorId: req.params.userId,
      competitionCode: req.params.competitionCode,
    });
    if (!forms) {
      return res.status(404).json({ error: "Forms not found" });
    }
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};

const getTemplateForms = async (req, res) => {
  try {
    const forms = await Form.find({ templateId: req.params.templateId });
    if (!forms) {
      return res.status(404).json({ error: "Forms not found" });
    }
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};

const deleteTemplate = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Template not found" });
  }

  try {
    await Template.findByIdAndDelete(id);
    await Form.deleteMany({ templateId: id });
    res
      .status(200)
      .json({ message: "Template and forms deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete template and forms" });
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
