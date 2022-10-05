const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  admin: { type: Boolean }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);