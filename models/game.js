/*const MySqlDb = require("./index.js");
const Season = MySqlDb.Season;

/*const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const {ObjectId} = mongoose.Schema; 

const Schema = mongoose.Schema;

const seasonGameSchema = new Schema({
  season: {type: mongoose.Types.ObjectId, ref: "Season"},
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

module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    season_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    game: {
      type: Sequelize.STRING,
      allowNull: false
    },
    played: {
      type: Sequelize.DATE,
      allowNull: false
    },
    final_result: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    players: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    goal_makers: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  
  return Game;
}




