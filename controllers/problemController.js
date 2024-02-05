const problemModel = require("../models/problemModel");

exports.getAll = (req, res) => {
  problemModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataProblems: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addProblem = async (req, res) => {
  const {
    idProblem,
    nameProblem,
    contentProblem,
    example,
    timeLimit,
    memoryLimit,
    tags,
    difficulty,
    description,
    idContest,
  } = req.body;
  const problem = new problemModel({
    idProblem: idProblem,
    nameProblem: nameProblem,
    contentProblem: contentProblem,
    example: example,
    timeLimit: timeLimit,
    memoryLimit: memoryLimit,
    tags: tags,
    difficulty: difficulty,
    description: description,
    idContest: idContest,
  });
  return problem
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created problem successfully",
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
    nameProblem,
    contentProblem,
    example,
    timeLimit,
    memoryLimit,
    tags,
    difficulty,
    description,
  } = req.body;
  problemModel
    .findOneAndUpdate(
      { idProblem: req.body.id },
      {
        nameProblem: nameProblem,
        contentProblem: contentProblem,
        example: example,
        timeLimit: timeLimit,
        memoryLimit: memoryLimit,
        tags: tags,
        difficulty: difficulty,
        description: description,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update problem successfully",
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
  problemModel
    .findOneAndDelete({ idProblem: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete problem successfully",
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

exports.updateTestCase = (req, res) => {
  const { testCase } = req.body;
  problemModel
    .findOneAndUpdate(
      { idProblem: req.body.id },
      {
        testCase: testCase,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update test case successfully",
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
exports.updateSolved = (req, res) => {
  const { solved } = req.body;
  problemModel
    .findOneAndUpdate(
      { idProblem: req.body.id },
      {
        solved: solved,
      }
    )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update solved successfully",
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
