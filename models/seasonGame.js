const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const {ObjectId} = mongoose.Schema; 

const Schema = mongoose.Schema;

const seasonGameSchema = new Schema({
  season: {type: mongoose.Types.ObjectId, ref: "season"},
  active: Boolean,
  game: String,
  final_result: String,
  players:[String],
  goal_makers:[String],
  description: String
 
});

/*const seasonGameSchema = new Schema({
  season_name: { type: ObjectId, ref: 'season' },
  active: Boolean,
  game: String,
  final_result: String,
  players:[String],
  goal_makers:[String],
  description: String
 
});*/

seasonGameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SeasonGame", seasonGameSchema);