const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: { type: String, required: true, trim: true, unique: true, lowercase: true },

        description: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tag", TagSchema);
