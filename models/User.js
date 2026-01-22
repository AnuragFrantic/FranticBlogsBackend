const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true, // store hashed password only
        },

        role: {
            type: String,
            enum: ["admin", "author"],
            default: "admin", // ✅ if only admin panel then keep admin
        },

        avatar: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// ✅ hide password in responses
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", UserSchema);
