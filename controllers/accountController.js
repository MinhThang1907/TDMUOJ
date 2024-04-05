const accountModel = require("../models/accountModel");

exports.getAll = (req, res) => {
  accountModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataAccounts: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addAccount = async (req, res) => {
  const { username, password, email, name, role } = req.body;
  const account = new accountModel({
    username: username,
    password: password,
    email: email,
    name: name,
    role: role,
  });
  return account
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created account successfully",
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

exports.updateAccount = (req, res) => {
  const { password, email, name } = req.body;
  accountModel
    .findByIdAndUpdate(req.body.id, {
      password: password,
      email: email,
      name: name,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update account successfully",
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

exports.deleteAccount = (req, res) => {
  accountModel
    .findByIdAndDelete(req.body.id, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete account successfully",
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

exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  accountModel
    .findByIdAndUpdate(req.body.id, {
      avatar: avatar,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update avatar successfully",
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
exports.updateRating = (req, res) => {
  const { rating } = req.body;
  accountModel
    .findByIdAndUpdate(req.body.id, {
      rating: rating,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update rating successfully",
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
exports.updateFollowers = (req, res) => {
  const { followers } = req.body;
  accountModel
    .findByIdAndUpdate(req.body.id, {
      followers: followers,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update followers successfully",
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
