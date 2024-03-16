const rankingContestModel = require("../models/rankingContestModel");

exports.getAll = (req, res) => {
  rankingContestModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataRankingContests: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addRankingContest = async (req, res) => {
  const { idContest, listUser } = req.body;
  const rankingContest = new rankingContestModel({
    idContest: idContest,
    listUser: listUser,
  });
  return rankingContest
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created ranking contest successfully",
        data: data,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

exports.updateRankingContest = (req, res) => {
  const { listUser } = req.body;
  rankingContestModel
    .findOneAndUpdate(
      { idContest: req.body.id },
      {
        listUser: listUser,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update ranking contest successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

exports.deleteRankingContest = (req, res) => {
  rankingContestModel
    .findOneAndDelete({ idContest: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete ranking contest successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};