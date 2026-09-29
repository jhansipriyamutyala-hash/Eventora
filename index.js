const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/student");
const eventRegistrationRoutes = require("./routes/eventRegistration");
const clubRoutes = require("./routes/club");

const Volunteer = require("./models/Volunteer");
const Certificate = require("./models/Certificates");

const app = express();

const PORT = process.env.PORT || 5000;

// ================= BUILT-IN MIDDLEWARE =================

app.use(cors());

app.use(express.json());

// ================= CUSTOM MIDDLEWARE =================

// This middleware runs before the API routes.
// It logs the HTTP method, URL and time of every request.

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );

  next();
});

// ================= DATABASE CONNECTION =================

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log(
      "Database Connected Successfully"
    );
  })
  .catch((err) => {
    console.log(
      "Database Connection Error:",
      err.message
    );
  });

// ================= STUDENT API =================

app.use(
  "/api/students",
  studentRoutes
);

// ================= EVENT REGISTRATION API =================

app.use(
  "/api/event-registrations",
  eventRegistrationRoutes
);

// ================= CLUB API =================

app.use(
  "/api/clubs",
  clubRoutes
);

// ================= VOLUNTEER API =================

app.post(
  "/api/volunteers/apply",
  async (req, res) => {
    try {
      const {
        eventId,
        eventName,
        eventDate,
        location,
        time,
        name,
        email,
        studentId,
        mobile,
        department,
        year,
      } = req.body;

      if (
        !eventId ||
        !eventName ||
        !eventDate ||
        !location ||
        !time ||
        !name ||
        !email ||
        !studentId ||
        !mobile ||
        !department ||
        !year
      ) {
        return res.status(400).json({
          error:
            "Please fill in all the fields.",
        });
      }

      if (
        !/^\d{10}$/.test(
          mobile.trim()
        )
      ) {
        return res.status(400).json({
          error:
            "Please enter a valid 10-digit mobile number.",
        });
      }

      const existingApplication =
        await Volunteer.findOne({
          eventId: Number(eventId),
          $or: [
            {
              email:
                email
                  .trim()
                  .toLowerCase(),
            },
            {
              studentId:
                studentId.trim(),
            },
          ],
        });

      if (existingApplication) {
        return res.status(400).json({
          error: `You have already applied for ${eventName}.`,
        });
      }

      const volunteer =
        new Volunteer({
          eventId:
            Number(eventId),

          eventName:
            eventName.trim(),

          eventDate:
            eventDate.trim(),

          location:
            location.trim(),

          time:
            time.trim(),

          name:
            name.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          studentId:
            studentId.trim(),

          mobile:
            mobile.trim(),

          department:
            department.trim(),

          year: year,

          status: "Applied",
        });

      await volunteer.save();

      res.status(201).json({
        message:
          "Volunteer Application Successful",

        volunteer,
      });
    } catch (err) {
      console.log(
        "Volunteer application error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ================= GET VOLUNTEERS =================

app.get(
  "/api/volunteers",
  async (req, res) => {
    try {
      const volunteers =
        await Volunteer.find().sort({
          appliedAt: -1,
        });

      res.json(volunteers);
    } catch (err) {
      console.log(
        "Get volunteers error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ================= CERTIFICATE API =================

app.post(
  "/api/certificates/complete",
  async (req, res) => {
    try {
      const {
        activityId,
        activityName,
        activityType,
        name,
        email,
        studentId,
        department,
        year,
      } = req.body;

      if (
        !activityId ||
        !activityName ||
        !activityType ||
        !name ||
        !email ||
        !studentId ||
        !department ||
        !year
      ) {
        return res.status(400).json({
          error:
            "Please provide all required certificate details.",
        });
      }

      const existingCertificate =
        await Certificate.findOne({
          activityId:
            Number(activityId),

          activityType:
            activityType,

          $or: [
            {
              email:
                email
                  .trim()
                  .toLowerCase(),
            },
            {
              studentId:
                studentId.trim(),
            },
          ],
        });

      if (existingCertificate) {
        return res.status(400).json({
          error:
            "Certificate has already been issued for this activity.",
        });
      }

      const certificate =
        new Certificate({
          name:
            name.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          studentId:
            studentId.trim(),

          department:
            department.trim(),

          year: year,

          activityId:
            Number(activityId),

          activityName:
            activityName.trim(),

          activityType:
            activityType,

          status:
            "Completed",

          certificateIssued:
            true,

          completedAt:
            new Date(),

          certificateIssuedAt:
            new Date(),
        });

      await certificate.save();

      if (
        activityType ===
        "Volunteer"
      ) {
        await Volunteer.findOneAndUpdate(
          {
            eventId:
              Number(activityId),

            email:
              email
                .trim()
                .toLowerCase(),
          },
          {
            status:
              "Completed",
          }
        );
      }

      res.status(201).json({
        message:
          "Activity marked as completed and certificate issued successfully.",

        certificate,
      });
    } catch (err) {
      console.log(
        "Certificate completion error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ================= GET CERTIFICATES =================

app.get(
  "/api/certificates",
  async (req, res) => {
    try {
      const certificates =
        await Certificate.find().sort({
          completedAt: -1,
        });

      res.json(certificates);
    } catch (err) {
      console.log(
        "Get certificates error:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ================= HOME API =================

app.get(
  "/",
  (req, res) => {
    res.send(
      "EVENTORA API is Running..."
    );
  }
);

// ================= START SERVER =================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);