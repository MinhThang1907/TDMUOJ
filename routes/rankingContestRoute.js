const express = require("express");
const rankingContestController = require("../controllers/rankingContestController");
const router = express.Router();

router.get("/ranking-contest", rankingContestController.getAll);
router.post("/ranking-contest", rankingContestController.addRankingContest);
router.put("/ranking-contest", rankingContestController.updateRankingContest);
router.put("/delete-ranking-contest", rankingContestController.deleteRankingContest);

module.exports = router;
