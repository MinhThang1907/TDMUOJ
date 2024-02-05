const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "/Images/default_avatar.png",
  },
  role: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  maxRating: {
    type: Number,
    default: 0,
  },
  numberOfAccepted: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("account", accountSchema);
