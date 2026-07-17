require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const applicationsRouter = require("./routes/applications");

const app = express();

app.use(express.json());

// Open to any origin for now - fine for a single-user personal project; tighten
// this to the deployed frontend's URL once one exists.
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/applications", applicationsRouter);

// Serve the built React app and let it handle client-side routing.
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT || 5000;

// Bootstraps the first admin from env vars so there's a way in without a
// public sign-up page. Idempotent - only fires when no users exist yet, so
// it's safe to leave running on every deploy/restart.
async function ensureAdminUser() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn(
      "No users exist and ADMIN_EMAIL/ADMIN_PASSWORD are not set - skipping admin bootstrap."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    email: ADMIN_EMAIL.toLowerCase().trim(),
    passwordHash,
    role: "admin",
  });
  console.log(`Bootstrapped admin user: ${ADMIN_EMAIL}`);
}

// Wait for the DB connection before listening, so no request can hit a route
// before Mongoose is actually ready to serve it.
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
