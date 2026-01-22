// Import dependencies
const mongoose = require("mongoose");

// Blog Schema with SEO Fields
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
    },
    banner: { type: String },
    thumbnail: { type: String },
    slug: { type: String, unique: true, trim: true },
    content: { type: String, },
    metaDescription: { type: String },
    keywords: { type: [String] },

}, { timestamps: true });


const Post = mongoose.model("Post", PostSchema);



module.exports = Post;