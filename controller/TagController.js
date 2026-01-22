const Tag = require("../models/Tags");

exports.createTag = async (req, res) => {
    try {
        const { name, slug, description, isActive } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ success: false, message: "name and slug are required" });
        }

        const exists = await Tag.findOne({ slug });
        if (exists) {
            return res.status(409).json({ success: false, message: "Tag slug already exists" });
        }

        const tag = await Tag.create({
            name,
            slug,
            description: description || "",
            isActive: isActive !== undefined ? isActive : true,
        });

        return res.status(201).json({ success: true, data: tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: tags });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;

        const tag = await Tag.findById(id);
        if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });

        tag.name = req.body.name ?? tag.name;
        tag.slug = req.body.slug ?? tag.slug;
        tag.description = req.body.description ?? tag.description;
        tag.isActive = req.body.isActive ?? tag.isActive;

        await tag.save();
        return res.status(200).json({ success: true, data: tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Tag.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Tag not found" });

        return res.status(200).json({ success: true, message: "Tag deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
