// REST API routes for job applications, mounted at /api/applications in server.js.
// Standard CRUD: list all, create, update, delete.

const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication");

// GET /api/applications - return every application, newest first.
router.get("/", async (req, res) => {
  const applications = await JobApplication.find().sort({ createdAt: -1 });
  res.json(applications);
});

// POST /api/applications - create a new application.
router.post("/", async (req, res) => {
  try {
    const application = await JobApplication.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    // Mongoose validation errors (e.g. missing required field) should be a 400,
    // not a generic server error.
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/applications/:id - update an existing application.
router.put("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return the updated doc, and re-check enum/required rules
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/applications/:id - remove an application.
router.delete("/:id", async (req, res) => {
  const application = await JobApplication.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.status(204).send();
});

module.exports = router;
