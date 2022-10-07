const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  header: String,
  content: String,
  date: Date
});

module.exports = mongoose.model("News", newsSchema);

