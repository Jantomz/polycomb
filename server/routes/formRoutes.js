const express = require("express");

// importing the function controllers to manipulate db
const {
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
} = require("../controllers/formController");

const router = express.Router();

// GET all templates
router.get("/templates", getTemplates);

// GET a template by id
router.get("/templates/:id", getTemplate);

// GET a template by competition code
router.get(
  "/competition-templates/:competitionCode",
  getTemplatesByCompetitionCode
);

// POST a template
router.post("/create-template", createTemplate);

// GET all forms
router.get("/forms", getForms);

// GET a form by id
router.get("/forms/:id", getForm);

// POST a form
router.post("/forms", createForm);

router.get("/user-forms/:competitionCode/:userId", getUserForms);

router.get("/template-forms/:templateId", getTemplateForms);

router.delete("/templates/:id", deleteTemplate);

module.exports = router;
