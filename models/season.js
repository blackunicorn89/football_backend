const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const seasonSchema = new Schema({
  season_name: {type: String, unique: true},
  active: Boolean
});

const gameOfSeasonSchema = Schema({
  _id: Schema.Types.ObjectId,
  season_name: {type: String, unique: true},
  active: boolean,
  season_games: [{ type: Schema.Types.ObjectId, ref: 'seasongames' }]
});

seasonSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Season", seasonSchema);

