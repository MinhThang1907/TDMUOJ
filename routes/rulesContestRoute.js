const express = require("express");
const rulesContestController = require("../controllers/rulesContestController");
const router = express.Router();

router.get("/rulesContest", rulesContestController.getAll);
router.post("/rulesContest", rulesContestController.addRulesContest);
router.put("/update-rulesContest", rulesContestController.updateRulesContest);
router.put("/delete-rulesContest", rulesContestController.deleteRulesContest);

module.exports = router;
