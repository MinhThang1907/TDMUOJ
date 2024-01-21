const mongoose = require("mongoose");
const problemSchema = new mongoose.Schema({
  idProblem: { type: String },
  nameProblem: { type: String },
  contentProblem: { type: String },
  example: { type: Array },
  timeLimit: { type: Number },
  memoryLimit: { type: Number },
  tags: { type: Array, default: [] },
  numberSolved: { type: Number, default: 0 },
  difficulty: { type: Number },
  description: { type: String },
  solved: { type: Array, default: [] },
  testCase: { type: Array, default: [] },
  idContest: { type: String, default: "none" },
});
module.exports = mongoose.model("problem", problemSchema);