// Entry point for the Express API server.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const applicationsRouter = require("./routes/applications");

const app = express();

// Parse JSON request bodies (needed for POST/PUT with a JSON payload).
app.use(express.json());

// Allow requests from any origin for now. This is fine for a single-user personal
// project; tighten this to the deployed frontend's URL once one exists.
app.use(cors());

// All job application CRUD routes live under /api/applications.
app.use("/api/applications", applicationsRouter);

// Connect to MongoDB Atlas, then start listening only once the DB connection is live
// so requests never hit a route before the database is ready.
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
