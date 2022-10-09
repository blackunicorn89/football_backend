const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  image: { type: String },
  player_name: String,
  player_number: { type: Number, unique: true },
  position: String,
  description: String,
});

playerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Player", playerSchema);
