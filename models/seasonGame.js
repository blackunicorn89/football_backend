const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const seasonGameSchema = new Schema({
  season_name: String,
  active: Boolean,
  game: String,
  final_result: String,
  players:[String],
  goal_makers:[String],
  description: String
 
});

seasonGameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SeasonGame", seasonGameSchema);