const tagProblemModel = require("../models/tagProblemModel");

exports.getAll = (req, res) => {
  tagProblemModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataTagProblems: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addTagProblem = async (req, res) => {
  const { nameTag } = req.body;
  const tag = new tagProblemModel({
    nameTag: nameTag,
  });
  return tag
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created tag successfully",
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

exports.updateTagProblem = (req, res) => {
  const { nameTag } = req.body;
  tagProblemModel
    .findByIdAndUpdate(req.body.id, {
      nameTag: nameTag,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update tag successfully",
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

exports.deleteTagProblem = (req, res) => {
  tagProblemModel
    .findByIdAndDelete(req.body.id, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete tag successfully",
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
