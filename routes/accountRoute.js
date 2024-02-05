const express = require("express");
const accountController = require("../controllers/accountController");
const router = express.Router();

router.get("/account", accountController.getAll);
router.post("/account", accountController.addAccount);
router.put("/update-account", accountController.updateAccount);
router.put("/delete-account", accountController.deleteAccount);
router.put("/update-avatar", accountController.updateAvatar);

module.exports = router;
