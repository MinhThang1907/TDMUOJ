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
  const { idContest, nameContest, writer, timeStart, lengthTime, problems } =
    req.body;
  const contest = new contestModel({
    idContest: idContest,
    nameContest: nameContest,
    writer: writer,
    timeStart: timeStart,
    lengthTime: lengthTime,
    problems: problems,
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
  const { nameContest, writer, timeStart, lengthTime, problems } = req.body;
  contestModel
    .findOneAndUpdate(
      { idContest: req.body.id },
      {
        nameContest: nameContest,
        writer: writer,
        timeStart: timeStart,
        lengthTime: lengthTime,
        problems: problems,
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
