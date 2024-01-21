const submissionModel = require("../models/submissionModel");

exports.getAll = (req, res) => {
  submissionModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataSubmissions: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addSubmission = async (req, res) => {
  const {
    idSubmission,
    idProblem,
    idUser,
    source,
    numberOfAcceptedTestCase,
    detailTestCase,
    maxTime,
    maxMemory,
    status,
    language,
    createTime,
  } = req.body;
  const submission = new submissionModel({
    idSubmission: idSubmission,
    idProblem: idProblem,
    idUser: idUser,
    source: source,
    numberOfAcceptedTestCase: numberOfAcceptedTestCase,
    detailTestCase: detailTestCase,
    maxTime: maxTime,
    maxMemory: maxMemory,
    status: status,
    language: language,
    createTime: createTime,
  });
  return submission
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created submission successfully",
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

exports.updateProblem = (req, res) => {
  const {
    numberOfAcceptedTestCase,
    detailTestCase,
    maxTime,
    maxMemory,
    status,
  } = req.body;
  submissionModel
    .findOneAndUpdate(
      { idSubmission: req.body.id },
      {
        numberOfAcceptedTestCase: numberOfAcceptedTestCase,
        detailTestCase: detailTestCase,
        maxTime: maxTime,
        maxMemory: maxMemory,
        status: status,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update submission successfully",
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

exports.deleteProblem = (req, res) => {
  submissionModel
    .findOneAndDelete({ idSubmission: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete submission successfully",
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