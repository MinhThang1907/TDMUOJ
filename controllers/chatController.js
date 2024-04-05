const chatModel = require("../models/chatModel");

exports.getAll = (req, res) => {
  chatModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataChats: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.addChat = async (req, res) => {
  const { idUserA, idUserB } = req.body;
  const chat = new chatModel({
    idUserA: idUserA,
    idUserB: idUserB,
  });
  return chat
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created chat successfully",
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

exports.updateChat = (req, res) => {
  const { messages } = req.body;
  chatModel
    .findByIdAndUpdate(req.body.id, {
      messages: messages,
    })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update messages successfully",
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
