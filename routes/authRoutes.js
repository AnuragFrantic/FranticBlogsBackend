const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, getMe } = require("../controller/UserController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, isAdmin, getMe);

module.exports = router;
