const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", async (req, res) => {
  const applications = await JobApplication.find({ user: req.userId }).sort({
    createdAt: -1,
  });
  res.json(applications);
});

router.post("/", async (req, res) => {
  try {
    const application = await JobApplication.create({
      ...req.body,
      user: req.userId,
    });
    res.status(201).json(application);
  } catch (err) {
    // Mongoose validation errors (e.g. missing required field) should be a 400,
    // not a generic server error.
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
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
  const application = await JobApplication.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.status(204).send();
});

module.exports = router;
