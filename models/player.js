const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  player_name: String,
  postion: String,
  player_number: { type: Number, unique: true },
  description: String,
  /*
  picture: { name:String, desc: String, img:{data: Buffer, contenttype:String}}
  */
});

Schema.virtual("id").get(function () {
  return this._id;
})

module.exports = mongoose.model("Player", Schema);