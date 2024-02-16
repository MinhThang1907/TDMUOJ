const rulesContestModel = require("../models/rulesContestModel");

exports.getAll = (req, res) => {
  rulesContestModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataRulesContests: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addRulesContest = async (req, res) => {
  const { content } = req.body;
  const rulesContest = new rulesContestModel({
    content: content,
  });
  return rulesContest
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created rules contest successfully",
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

exports.updateRulesContest = (req, res) => {
  const { content } = req.body;
  rulesContestModel
    .findOneAndUpdate(
      { _id: req.body.id },
      {
        content: content,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update rules contest successfully",
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

exports.deleteRulesContest = (req, res) => {
  rulesContestModel
    .findOneAndDelete({ _id: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete rules contest successfully",
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
