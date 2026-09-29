const mongoose = require("mongoose");

const EventRegistrationSchema =
  new mongoose.Schema(
    {
      eventId: {
        type: Number,
        required: true,
      },

      eventName: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
      },

      studentId: {
        type: String,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
      },

      department: {
        type: String,
        required: true,
      },

      year: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "EventRegistration",
  EventRegistrationSchema
);