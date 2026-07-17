const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { sendPasswordResetEmail } = require("../utils/mailer");

const TOKEN_TTL = "7d";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user) {
  return { id: user._id, email: user.email, role: user.role };
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
  res.json({ token, user: toPublicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json(toPublicUser(req.user));
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = hashResetToken(rawToken);
    user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      console.error("Failed to send password reset email:", err.message);
    }
  }

  // Same response whether or not the account exists, so this endpoint can't
  // be used to enumerate registered emails.
  res.json({ message: "If that email is registered, a reset link has been sent." });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const user = await User.findOne({
    resetTokenHash: hashResetToken(token),
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset link" });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.passwordChangedAt = new Date();
  user.resetTokenHash = null;
  user.resetTokenExpires = null;
  await user.save();

  res.json({ message: "Password updated" });
});

module.exports = router;
