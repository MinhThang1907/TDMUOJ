const resetPasswordModel = require("../models/resetPasswordModel");

exports.getAll = (req, res) => {
  resetPasswordModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataResetPasswords: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addResetPassword = async (req, res) => {
  const { idReset, email } = req.body;
  const resetPassword = new resetPasswordModel({
    idReset: idReset,
    email: email,
  });
  return resetPassword
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created id reset password successfully",
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

exports.deleteResetPassword = (req, res) => {
  resetPasswordModel
    .findOneAndDelete({ idReset: req.body.id }, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete id reset password successfully",
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
