const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  season_name: String,
  games: String, //refs season_games, season_name
  active: Boolean,
  description: String 
});

module.exports = mongoose.model("Season", Schema);