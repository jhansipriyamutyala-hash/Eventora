const express = require("express");

const router = express.Router();

const Club = require("../models/Club");

// ================= DEFAULT CLUBS =================

const defaultClubs = [
  {
    clubId: 1,
    name: "Coding Club",
    description:
      "Learn programming, development and problem solving through practical activities.",
    members: 120,
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
  },

  {
    clubId: 2,
    name: "Photography Club",
    description:
      "Explore photography, editing and creative storytelling through campus events.",
    members: 85,
    category: "Creative",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
  },

  {
    clubId: 3,
    name: "Cultural Club",
    description:
      "Participate in cultural programs, music, dance and other campus activities.",
    members: 150,
    category: "Cultural",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
  },

  {
    clubId: 4,
    name: "Sports Club",
    description:
      "Take part in sports activities, competitions and campus tournaments.",
    members: 110,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
  },

  {
    clubId: 5,
    name: "Literary Club",
    description:
      "Improve communication and creativity through writing, reading and discussions.",
    members: 70,
    category: "Literary",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
  },

  {
    clubId: 6,
    name: "Music Club",
    description:
      "Connect with fellow music lovers and participate in musical performances.",
    members: 95,
    category: "Music",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
  },
];

// ================= GET ALL CLUBS =================

router.get("/", async (req, res) => {
  try {
    let clubs = await Club.find().sort({
      clubId: 1,
    });

    // Create default clubs if collection is empty
    if (clubs.length === 0) {
      await Club.insertMany(defaultClubs);

      clubs = await Club.find().sort({
        clubId: 1,
      });
    }

    res.json(clubs);
  } catch (err) {
    console.log("Get clubs error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET SINGLE CLUB =================

router.get("/:clubId", async (req, res) => {
  try {
    const club = await Club.findOne({
      clubId: Number(req.params.clubId),
    });

    if (!club) {
      return res.status(404).json({
        error: "Club not found.",
      });
    }

    res.json(club);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= JOIN CLUB =================

router.post("/:clubId/join", async (req, res) => {
  try {
    const {
      name,
      email,
      studentId,
      mobile,
      department,
      year,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !studentId ||
      !mobile ||
      !department ||
      !year
    ) {
      return res.status(400).json({
        error: "Please fill in all the fields.",
      });
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(mobile.trim())) {
      return res.status(400).json({
        error:
          "Please enter a valid 10-digit mobile number.",
      });
    }

    // Find club
    const club = await Club.findOne({
      clubId: Number(req.params.clubId),
    });

    if (!club) {
      return res.status(404).json({
        error: "Club not found.",
      });
    }

    // Check duplicate registration
    const alreadyJoined = club.registrations.some(
      (registration) =>
        registration.email ===
          email.trim().toLowerCase() ||
        registration.studentId ===
          studentId.trim()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        error: `You are already a member of ${club.name}.`,
      });
    }

    // Add registration
    club.registrations.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      mobile: mobile.trim(),
      department: department.trim(),
      year,
    });

    // Increase member count
    club.members += 1;

    await club.save();

    res.status(201).json({
      message: `Successfully joined ${club.name}!`,
      club,
    });
  } catch (err) {
    console.log("Club registration error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET CLUB MEMBERS =================

router.get("/:clubId/members", async (req, res) => {
  try {
    const club = await Club.findOne({
      clubId: Number(req.params.clubId),
    });

    if (!club) {
      return res.status(404).json({
        error: "Club not found.",
      });
    }

    res.json(club.registrations);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;