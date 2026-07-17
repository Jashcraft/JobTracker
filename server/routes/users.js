const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth, requireAdmin);

function toPublicUser(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

router.get("/", async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });
  res.json(users.map(toPublicUser));
});

router.post("/", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role === "admin" ? "admin" : "user",
    });
    res.status(201).json(toPublicUser(user));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A user with that email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/password", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { passwordHash, passwordChangedAt: new Date() },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(toPublicUser(user));
});

router.delete("/:id", async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(400).json({ error: "You cannot remove your own account" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await JobApplication.deleteMany({ user: user._id });
  res.status(204).send();
});

module.exports = router;
