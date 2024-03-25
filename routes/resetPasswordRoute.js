const express = require("express");
const resetPasswordController = require("../controllers/resetPasswordController");
const router = express.Router();

router.get("/reset-password", resetPasswordController.getAll);
router.post("/reset-password", resetPasswordController.addResetPassword);
router.put("/delete-reset-password", resetPasswordController.deleteResetPassword);

module.exports = router;
