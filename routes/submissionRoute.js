const express = require("express");
const submissionController = require("../controllers/submissionController");
const router = express.Router();

router.get("/submission", submissionController.getAll);
router.post("/submission", submissionController.addSubmission);
router.put("/update-submission", submissionController.updateProblem);
router.put("/delete-submission", submissionController.deleteProblem);

module.exports = router;
