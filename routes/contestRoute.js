const express = require("express");
const contestController = require("../controllers/contestController");
const router = express.Router();

router.get("/contest", contestController.getAll);
router.post("/contest", contestController.addContest);
router.put("/update-contest", contestController.updateContest);
router.put("/update-participants", contestController.updateParticipants);
router.put("/delete-contest", contestController.deleteContest);

module.exports = router;
