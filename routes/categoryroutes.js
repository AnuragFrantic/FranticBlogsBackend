const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multer");

const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controller/CategoryController");
const Store = require("../middleware/multer");

router.post("/", Store('image').fields(
    [
        { name: "icon", maxCount: 1 },

    ]
), createCategory);
router.get("/", getCategories);
router.put("/:id", Store('image').fields(
    [
        { name: "icon", maxCount: 1 },

    ]
), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
