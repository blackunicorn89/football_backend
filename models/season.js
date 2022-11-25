const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const seasonSchema = new Schema({
  season_name: {type: String, unique: true},
  active: Boolean
});

seasonSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Season", seasonSchema);