//This Sequelize Model represents news table in MySQL database. These columns will be generated automatically: id, header, content, date, createdAt, updatedAt.

module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    player_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    player_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true

    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });
  
  return Player;
}


/*const mongoose = require("mongoose");
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

module.exports = mongoose.model("Player", playerSchema);*/
