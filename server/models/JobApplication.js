const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
    },

    // Slug values (no spaces) so status is safe to use in URLs and as a CSS class
    // for status-color badges. Frontend maps each slug to a label/color.
    status: {
      type: String,
      enum: [
        "not_started",
        "materials_prepped",
        "applied",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ],
      default: "not_started",
    },

    dateFound: {
      type: Date,
    },

    dateApplied: {
      type: Date,
      default: null,
    },

    coverLetterWritten: {
      type: String,
      enum: ["Y", "N", "N_not_requested"],
      default: "N",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
