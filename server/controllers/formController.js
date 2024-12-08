// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const Form = require("../models/formModel");
const Template = require("../models/formTemplateModel");

const mongoose = require("mongoose");

// TODO: Verify for all endpoints that create something or alter something, that the request body is in the right format

// get all templates
const getTemplates = async (req, res) => {
  const templates = await Template.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(templates);
};

// get a template by id
const getTemplate = async (req, res) => {
  console.log("Getting template: ", req.params.id);
  const template = await Template.findOne({
    _id: req.params.id,
  });

  if (!template) {
    return res.status(404).json({ error: "Template not found" });
  }
  res.status(200).json(template);
};

// create a template
const createTemplate = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  console.log("Creating template: ", req.body);

  const template = new Template(req.body);
  await template.save();
  res.status(201).json(template);
};

// get all forms
const getForms = async (req, res) => {
  const forms = await Form.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(forms);
};

// get a form by id
const getForm = async (req, res) => {
  const form = await Form.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });

  if (!form) {
    return res.status(404).json({ error: "Form not found" });
  }

  res.status(200).json(form);
};

const getTemplatesByCompetitionCode = async (req, res) => {
  const templates = await Template.find({
    competitionCode: req.params.competitionCode,
  });

  if (!templates) {
    return res.status(404).json({ error: "Templates not found" });
  }

  res.status(200).json(templates);
};

// create a form
// TODO: Verify the form follows the schema of the appopriate template
const createForm = async (req, res) => {
  // ensure a user can't a form multiple times
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  console.log("Creating form: ", req.body);

  const form = new Form(req.body);
  await form.save();
  res.status(201).json(form);
};

const getUserForms = async (req, res) => {
  const forms = await Form.find({
    creatorId: req.params.userId,
    competitionCode: req.params.competitionCode,
  });

  if (!forms) {
    return res.status(404).json({ error: "Forms not found" });
  }

  res.status(200).json(forms);
};

const getTemplateForms = async (req, res) => {
  const forms = await Form.find({
    templateId: req.params.templateId,
  });

  if (!forms) {
    return res.status(404).json({ error: "Forms not found" });
  }

  res.status(200).json(forms);
};

const deleteTemplate = async (req, res) => {
  const { id } = req.params;

  console.log("Deleting template: ", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Template not found" });
  }

  await Template.findByIdAndDelete(id);

  await Form.deleteMany({ templateId: id });

  res.status(200).json({ message: "Template and forms deleted successfully" });
};

// exporting all the function controllers
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
