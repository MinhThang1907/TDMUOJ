const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema({
  title: { type: String, default: "[Không có tiêu đề]" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  idUser: { type: String, default: "" },
  pending: { type: Boolean, default: true },
});
module.exports = mongoose.model("news", newsSchema);
