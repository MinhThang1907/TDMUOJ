const newsModel = require("../models/newsModel");

exports.getAll = (req, res) => {
  newsModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataNews: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addNews = async (req, res) => {
  const { title, content, image, idUser, pending } = req.body;
  const news = new newsModel({
    title: title,
    content: content,
    image: image,
    idUser: idUser,
    pending: pending,
  });
  return news
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created news successfully",
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

exports.updateNews = (req, res) => {
  const { title, content, image } = req.body;
  newsModel
    .findByIdAndUpdate(req.body.id, {
      title: title,
      content: content,
      image: image,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update news successfully",
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

exports.deleteNews = (req, res) => {
  newsModel
    .findByIdAndDelete(req.body.id, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Delete news successfully",
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

exports.acceptNews = (req, res) => {
  const { pending } = req.body;
  newsModel
    .findByIdAndUpdate(req.body.id, {
      pending: pending,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Accept news successfully",
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
