const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.get("/chat", chatController.getAll);
router.post("/chat", chatController.addChat);
router.put("/chat", chatController.updateChat);

module.exports = router;
