const contestModel = require("../models/contestModel");

exports.getAll = (req, res) => {
  contestModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataContests: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addContest = async (req, res) => {
  const {
    idContest,
    nameContest,
    writer,
    timeStart,
    lengthTime,
    problems,
    rules,
    virtualMode,
  } = req.body;
  const contest = new contestModel({
    idContest: idContest,
    nameContest: nameContest,
    writer: writer,
    timeStart: timeStart,
    lengthTime: lengthTime,
    problems: problems,
    rules: rules,
    virtualMode: virtualMode,
  });
  return contest
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created contest successfully",
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

exports.updateContest = (req, res) => {
  const { nameContest, writer, timeStart, lengthTime, problems, rules } =
    req.body;
  contestModel
    .findOneAndUpdate(
      { idContest: req.body.id },
      {
        nameContest: nameContest,
        writer: writer,
        timeStart: timeStart,
        lengthTime: lengthTime,
        problems: problems,
        rules: rules,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update contest successfully",
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

exports.deleteContest = (req, res) => {
  contestModel
    .findOneAndDelete({ idContest: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete contest successfully",
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

exports.updateParticipants = (req, res) => {
  const { participants } = req.body;
  contestModel
    .findOneAndUpdate(
      { idContest: req.body.id },
      {
        participants: participants,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update participants successfully",
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

exports.updateRatingChange = (req, res) => {
  const { ratingChange } = req.body;
  contestModel
    .findOneAndUpdate(
      { idContest: req.body.id },
      {
        ratingChange: ratingChange,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update ratingChange successfully",
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