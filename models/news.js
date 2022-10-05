const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  header: String,
  Content: String,
  Date: Date
});

module.exports = mongoose.model("News", Schema);