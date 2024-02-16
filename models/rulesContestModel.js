const mongoose = require("mongoose");
const rulesContestSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("rulesContest", rulesContestSchema);
