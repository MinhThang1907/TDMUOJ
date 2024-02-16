const mongoose = require("mongoose");
const contestSchema = new mongoose.Schema({
  idContest: {
    type: String,
  },
  nameContest: {
    type: String,
  },
  writer: {
    type: Array,
    default: [],
  },
  timeStart: {
    type: String,
  },
  lengthTime: {
    type: Number,
  },
  participants: {
    type: Array,
    default: [],
  },
  problems: {
    type: Array,
    default: [],
  },
  askQuestion: {
    type: Array,
    default: [],
  },
  rules: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("contest", contestSchema);
