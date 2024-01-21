const express = require("express");
const tagProblemController = require("../controllers/tagProblemController");
const router = express.Router();

router.get("/tag", tagProblemController.getAll);
router.post("/tag", tagProblemController.addTagProblem);
router.put("/update-tag", tagProblemController.updateTagProblem);
router.put("/delete-tag", tagProblemController.deleteTagProblem);

module.exports = router;
