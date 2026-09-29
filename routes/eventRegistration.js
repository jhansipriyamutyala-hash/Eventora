const express = require("express");

const router = express.Router();

const EventRegistration = require("../models/EventRegistration");

// ================= REGISTER FOR EVENT =================

router.post("/register", async (req, res) => {
  try {
    const {
      eventId,
      eventName,
      name,
      email,
      studentId,
      mobile,
      department,
      year,
    } = req.body;

    // Required fields
    if (
      !eventId ||
      !eventName ||
      !name ||
      !email ||
      !studentId ||
      !mobile ||
      !department ||
      !year
    ) {
      return res.status(400).json({
        error: "Please fill in all fields.",
      });
    }

    // Check duplicate registration
    const existingRegistration =
      await EventRegistration.findOne({
        eventId,
        $or: [
          {
            email: email.trim().toLowerCase(),
          },
          {
            studentId: studentId.trim(),
          },
        ],
      });

    if (existingRegistration) {
      return res.status(400).json({
        error: `You have already registered for ${eventName}.`,
      });
    }

    // Create registration
    const registration =
      new EventRegistration({
        eventId,
        eventName,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim(),
        mobile: mobile.trim(),
        department: department.trim(),
        year,
      });

    await registration.save();

    res.status(201).json({
      message: "Event Registration Successful",
      registration,
    });
  } catch (err) {
    console.log(
      "Event registration error:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET ALL EVENT REGISTRATIONS =================

router.get("/", async (req, res) => {
  try {
    const registrations =
      await EventRegistration.find().sort({
        createdAt: -1,
      });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;