const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication");

router.get("/", async (req, res) => {
  const applications = await JobApplication.find().sort({ createdAt: -1 });
  res.json(applications);
});

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

router.put("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Mongoose skips validation on update by default
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const application = await JobApplication.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.status(204).send();
});

module.exports = router;
