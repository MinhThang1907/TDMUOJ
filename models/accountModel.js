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
  role: {
    type: String,
  },
});
module.exports = mongoose.model("account", accountSchema);
