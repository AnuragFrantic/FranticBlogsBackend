const express = require("express");
const router = express.Router();

const { createTag, getTags, updateTag, deleteTag } = require("../controller/TagController");

router.post("/", createTag);
router.get("/", getTags);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
