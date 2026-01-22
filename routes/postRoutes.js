const express = require("express");
const Store = require("../middleware/multer");
const router = express.Router();

const {
    create_blog,
    get_blog,
    latest_blog,
    update_blog,
    delete_blog,
} = require("../controller/PostController");



// router.post("/", upload.single("coverImage"), createPost);
// router.get("/", getPosts);
// router.get("/:slug", getPostBySlug);
// router.put("/:id", upload.single("coverImage"), updatePost);
// router.delete("/:id", deletePost);



router.post('/', Store('image').fields(
    [
        { name: "banner", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]
), create_blog);

router.get('/', get_blog);
router.get('/latest', latest_blog);


router.put('/:id', Store('image').fields(
    [
        { name: "banner", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]
), update_blog);
router.delete('/:id', delete_blog);

module.exports = router;
