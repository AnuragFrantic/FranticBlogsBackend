const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: { type: String, required: true, trim: true, unique: true, lowercase: true },

        description: { type: String, default: "" },

        icon: { type: String, default: "" }, // ✅ multer icon image URL
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
