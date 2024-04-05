const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  idUserA: {
    type: String,
  },
  idUserB: {
    type: String,
  },
  messages: {
    type: [
      {
        idUser: {
          type: String,
        },
        content: {
          type: Array,
        },
      },
    ],
    default: [],
  },
});
module.exports = mongoose.model("chat", chatSchema);
