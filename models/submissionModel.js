const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema({
  idSubmission: { type: String },
  idProblem: { type: String },
  idUser: { type: String },
  source: { type: String },
  numberOfAcceptedTestCase: { type: Number, default: 0 },
  detailTestCase: { type: Array, default: [] },
  maxTime: { type: Number },
  maxMemory: { type: Number },
  status: { type: String },
  language: { type: String },
  createTime: { type: String },
});
module.exports = mongoose.model("submission", submissionSchema);
