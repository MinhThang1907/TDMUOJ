const express = require("express");
const compilerController = require("../controllers/compilerController");
const router = express.Router();

router.post("/compile", compilerController.Compiler);

module.exports = router;
