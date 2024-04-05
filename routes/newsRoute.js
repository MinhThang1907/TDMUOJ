const express = require("express");
const newsController = require("../controllers/newsController");
const router = express.Router();

router.get("/news", newsController.getAll);
router.post("/news", newsController.addNews);
router.put("/update-news", newsController.updateNews);
router.put("/delete-news", newsController.deleteNews);
router.put("/accept-news", newsController.acceptNews);

module.exports = router;