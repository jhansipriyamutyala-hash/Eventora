const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// ================= REGISTER STUDENT =================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      mobile,
      department,
      year,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !studentId
    ) {
      return res.status(400).json({
        error: "Please fill in all required fields.",
      });
    }

    // Check existing email
    const existingEmail = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        error: "Email is already registered.",
      });
    }

    // Check existing student ID
    const existingStudentId =
      await Student.findOne({
        studentId: studentId,
      });

    if (existingStudentId) {
      return res.status(400).json({
        error: "Student ID is already registered.",
      });
    }

    // Create student
    const student = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      studentId: studentId.trim(),
      mobile: mobile || "",
      department: department || "",
      year: year || "",
    });

    await student.save();

    res.status(201).json({
      message: "Student Registered Successfully",
      student,
    });
  } catch (err) {
    console.log("Student registration error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET ALL STUDENTS =================

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= LOGIN STUDENT =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!student) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    if (student.password !== password) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    res.json({
      message: "Login Successful",
      student,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;