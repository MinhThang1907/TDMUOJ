const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema({
  idSubmission: { type: String },
  idProblem: { type: String },
  idUser: { type: String },
  idContest: { type: String },
  source: { type: String },
  numberOfAcceptedTestCase: { type: Number, default: 0 },
  detailTestCase: { type: Array, default: [] },
  maxTime: { type: Number, default: 0 },
  maxMemory: { type: Number, default: 0 },
  status: { type: String },
  colorStatus: { type: String },
  idLanguage: { type: Number },
  language: { type: String },
  createTime: { type: String },
  time: { type: String },
});
module.exports = mongoose.model("submission", submissionSchema);
