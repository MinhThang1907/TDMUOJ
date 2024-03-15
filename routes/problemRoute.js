const express = require("express");
const problemController = require("../controllers/problemController");
const router = express.Router();

router.get("/problems", problemController.getAll);
router.post("/problems", problemController.addProblem);
router.put("/update-problems", problemController.updateProblem);
router.put("/delete-problems", problemController.deleteProblem);
router.put("/update-testcase-problems", problemController.updateTestCase);
router.put("/update-solved-problems", problemController.updateSolved);
router.put("/update-status-problems", problemController.changeStatus);
router.put("/update-idContest-problems", problemController.updateIdContest);

module.exports = router;
