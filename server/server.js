require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const applicationsRouter = require("./routes/applications");

const app = express();

app.use(express.json());

// Open to any origin for now - fine for a single-user personal project; tighten
// this to the deployed frontend's URL once one exists.
app.use(cors());

app.use("/api/applications", applicationsRouter);

const PORT = process.env.PORT || 5000;

// Wait for the DB connection before listening, so no request can hit a route
// before Mongoose is actually ready to serve it.
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
