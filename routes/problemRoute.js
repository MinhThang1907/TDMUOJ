const express = require("express");
const problemController = require("../controllers/problemController");
const router = express.Router();

router.get("/problems", problemController.getAll);
router.post("/problems", problemController.addProblem);
router.put("/update-problems", problemController.updateProblem);
router.put("/delete-problems", problemController.deleteProblem);
router.put("/update-testcase-problems", problemController.updateTestCase);

module.exports = router;
