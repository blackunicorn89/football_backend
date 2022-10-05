const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  home_teamn: String,
  visitor_team: String,
  player_name: String, //refs players player_name
  goal_maker: String, //refs players player_name
  final_result: Number,
  description: String
});

module.exports = mongoose.model("SeasonGame", Schema);