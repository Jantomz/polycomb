const express = require("express");

// Importing the function controllers to manipulate the database
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

const router = express.Router(); // Creating a new router object

// GET all templates - Retrieves all template records from the database
router.get("/templates", getTemplates);

// GET a template by id - Fetches a specific template using its unique ID
router.get("/templates/:id", getTemplate);

// GET a template by competition code - Fetches templates associated with a specific competition code
router.get(
  "/competition-templates/:competitionCode",
  getTemplatesByCompetitionCode
);

// POST a template - Adds a new template to the database
router.post("/create-template", createTemplate);

// GET all forms - Retrieves all form records from the database
router.get("/forms", getForms);

// GET a form by id - Fetches a specific form using its unique ID
router.get("/forms/:id", getForm);

// POST a form - Adds a new form to the database
router.post("/forms", createForm);

// GET user forms by competition code and user ID - Fetches forms submitted by a specific user for a specific competition
router.get("/user-forms/:competitionCode/:userId", getUserForms);

// GET forms by template ID - Fetches all forms associated with a specific template
router.get("/template-forms/:templateId", getTemplateForms);

// DELETE a template by id - Removes a specific template from the database using its unique ID
router.delete("/templates/:id", deleteTemplate);

module.exports = router; // Exporting the router to be used in other parts of the application
