const Blog = require("../models/Post");

const makeSlug = (title = "") => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

// ✅ helper: parse keywords
const parseKeywords = (keywords) => {
    if (!keywords) return [];

    if (Array.isArray(keywords)) return keywords;

    if (typeof keywords === "string") {
        try {
            const parsed = JSON.parse(keywords);
            if (Array.isArray(parsed)) return parsed;
        } catch (err) {
            return keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean);
        }
    }

    return [];
};

// ✅ generate unique slug
const generateUniqueSlug = async (title, excludeId = null) => {
    let slug = makeSlug(title);
    let finalSlug = slug;
    let count = 1;

    while (true) {
        const query = { slug: finalSlug };
        if (excludeId) query._id = { $ne: excludeId };

        const exists = await Blog.findOne(query).select("_id");
        if (!exists) break;

        count += 1;
        finalSlug = `${slug}-${count}`;
    }

    return finalSlug;
};

exports.create_blog = async (req, res) => {
    try {
        const data = { ...req.body };

        // ✅ validate
        if (!data.title?.trim()) {
            return res.json({ success: 0, message: "Title is required" });
        }
        if (!data.content?.trim()) {
            return res.json({ success: 0, message: "Content is required" });
        }

        // ✅ keywords parse
        data.keywords = parseKeywords(req.body.keywords);

        // ✅ slug generate unique
        data.slug = await generateUniqueSlug(data.title);

        // ✅ files
        if (req.files?.banner?.length) data.banner = req.files.banner[0].path;
        if (req.files?.thumbnail?.length) data.thumbnail = req.files.thumbnail[0].path;

        const resp = await Blog.create(data);

        return res.json({
            success: 1,
            message: "Blog created successfully",
            data: resp,
        });
    } catch (err) {
        return res.json({ success: 0, message: err.message });
    }
};

exports.get_blog = async (req, res) => {
    try {
        const { id, url, keyword } = req.query;

        const perPage = Number(req.query.perPage || 10);
        const page = Number(req.query.page || 1);

        const filter = {};

        if (id) filter._id = id;
        if (url) filter.slug = url;

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { metaDescription: { $regex: keyword, $options: "i" } },
                { content: { $regex: keyword, $options: "i" } },
            ];
        }

        const totalDocs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / perPage);
        const skip = (page - 1) * perPage;

        const resp = await Blog.find(filter)
            .populate("category") // ✅ if category exists
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);

        return res.json({
            success: 1,
            message: "Blog fetched successfully",
            data: resp,
            pagination: {
                totalPages,
                perPage,
                page,
                totalDocs,
            },
        });
    } catch (err) {
        return res.json({ success: 0, message: err.message });
    }
};

exports.latest_blog = async (req, res) => {
    try {
        const { id, url } = req.query;
        const filter = {};

        if (id) filter._id = { $ne: id };
        if (url) filter.slug = { $ne: url };

        const resp = await Blog.find(filter)
            .populate("category")
            .sort({ createdAt: -1 })
            .limit(6);

        return res.json({
            success: 1,
            message: "Latest blogs fetched successfully",
            data: resp,
        });
    } catch (err) {
        return res.json({ success: 0, message: err.message });
    }
};

exports.update_blog = async (req, res) => {
    try {
        const { id } = req.params;

        const old = await Blog.findById(id);
        if (!old) return res.json({ success: 0, message: "Blog not found" });

        const data = { ...req.body };

        // ✅ keywords
        if ("keywords" in req.body) {
            data.keywords = parseKeywords(req.body.keywords);
        }

        // ✅ regenerate slug only if title updated
        if (data.title?.trim()) {
            data.slug = await generateUniqueSlug(data.title, id);
        }

        // ✅ files
        if (req.files?.banner?.length) data.banner = req.files.banner[0].path;
        if (req.files?.thumbnail?.length) data.thumbnail = req.files.thumbnail[0].path;

        const resp = await Blog.findByIdAndUpdate(id, { $set: data }, { new: true });

        return res.json({
            success: 1,
            message: "Blog updated successfully",
            data: resp,
        });
    } catch (err) {
        return res.json({ success: 0, message: err.message });
    }
};

exports.delete_blog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) return res.json({ success: 0, message: "Blog not found" });

        await Blog.deleteOne({ _id: id });

        return res.json({
            success: 1,
            message: "Blog deleted successfully",
        });
    } catch (err) {
        return res.json({ success: 0, message: err.message });
    }
};
