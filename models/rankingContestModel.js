const mongoose = require("mongoose");
const rankingContestSchema = new mongoose.Schema({
  idContest: {
    type: String,
  },
  listUser: {
    type: [
      {
        rank: Number,
        idUser: String,
        score: Number,
        penalty: Number,
        problems: [
          {
            idProblem: String,
            nameProblem: String,
            idSubmission: [String],
          },
        ],
      },
    ],
    default: [],
  },
  virtualUsers: {
    type: [
      {
        rank: Number,
        idUser: String,
        score: Number,
        penalty: Number,
        problems: [
          {
            idProblem: String,
            nameProblem: String,
            idSubmission: [String],
          },
        ],
      },
    ],
    default: [],
  },
});
module.exports = mongoose.model("rankingContest", rankingContestSchema);
