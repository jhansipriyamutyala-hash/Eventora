const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    // ================= STUDENT DETAILS =================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      required: true,
    },

    // ================= ACTIVITY DETAILS =================

    activityId: {
      type: Number,
      required: true,
    },

    activityName: {
      type: String,
      required: true,
      trim: true,
    },

    activityType: {
      type: String,
      required: true,
      enum: [
        "Event",
        "Volunteer",
        "Club",
      ],
    },

    // ================= COMPLETION =================

    status: {
      type: String,
      enum: [
        "Completed",
      ],
      default: "Completed",
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },

    // ================= CERTIFICATE =================

    certificateIssued: {
      type: Boolean,
      default: true,
    },

    certificateIssuedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Certificate",
  CertificateSchema
);