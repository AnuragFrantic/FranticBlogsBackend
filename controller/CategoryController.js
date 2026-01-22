const Category = require("../models/Category");

const makeFileUrl = (req, filename) => {
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description, isActive } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ success: false, message: "name and slug are required" });
        }

        const exists = await Category.findOne({ slug });
        if (exists) {
            return res.status(409).json({ success: false, message: "Category slug already exists" });
        }

        const iconUrl = req.file ? makeFileUrl(req, req.file.filename) : "";

        const category = await Category.create({
            name,
            slug,
            description: description || "",
            isActive: isActive !== undefined ? isActive : true,
            icon: iconUrl,
        });

        return res.status(201).json({ success: true, data: category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        category.name = req.body.name ?? category.name;
        category.slug = req.body.slug ?? category.slug;
        category.description = req.body.description ?? category.description;
        category.isActive = req.body.isActive ?? category.isActive;

        if (req.file) {
            category.icon = makeFileUrl(req, req.file.filename);
        }

        await category.save();
        return res.status(200).json({ success: true, data: category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

        return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
