const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  header: String,
  content: String,
  date: Date
});

module.exports = mongoose.model("News", Schema);