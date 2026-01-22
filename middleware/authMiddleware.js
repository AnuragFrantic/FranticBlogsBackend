const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ verify token
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token user" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token invalid" });
    }
};

// ✅ admin only middleware
exports.isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access only" });
    }
    next();
};
