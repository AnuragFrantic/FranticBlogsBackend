const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
};

// ✅ Admin Register (only for first admin setup)
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({
            name,
            email,
            password, // ⚠️ plain text (as you requested)
            role: "admin",
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // ✅ No bcrypt: direct compare
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Logged-in Admin Profile
exports.getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
