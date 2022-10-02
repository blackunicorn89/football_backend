const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  admin: Boolean
});

module.exports = mongoose.model("User", Schema);