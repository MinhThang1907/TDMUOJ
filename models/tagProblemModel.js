const mongoose = require("mongoose");
const tagProblemSchema = new mongoose.Schema({
  nameTag: { type: String },
});
module.exports = mongoose.model("tagProblem", tagProblemSchema);
