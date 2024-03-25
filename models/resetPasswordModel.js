const mongoose = require("mongoose");
const resetPasswordSchema = new mongoose.Schema({
  idReset: {
    type: String,
  },
  email: {
    type: String,
  },
});
module.exports = mongoose.model("resetPassword", resetPasswordSchema);
