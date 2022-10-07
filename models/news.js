/*const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  header: String,
  content: String,
  date: Date
});

module.exports = mongoose.model("News", Schema);*/


const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const newsSchema = new Schema({
  header: String,
  content: String,
  date: Date
});


module.exports = mongoose.model("News", newsSchema);
