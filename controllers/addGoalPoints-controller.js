const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const MySqlGameModel = MySqlDb.Game;


// LISTAA KAIKKI KAUDEN PELIT

/*const getGames = async (req, res, next) => {

  let games;

  try {
    games = await MySqlGameModel.findAll({})
  } catch (err) {
    const error = new HttpError("Fetching games failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(games);
};*/

// HAE KAUDEN PELI ID:N AVULLA 

/*const getSeasonById = async (req, res, next) => {
  const seasonId = req.params.id;
  let season

  try {
    season = await season.findById(seasonId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find the season data", 500);
    return next(error);
  }

  if (!player) {
    const error = new HttpError("Could not find a player for the provided id.", 404);
    return next(error)
  }

  res.status(200).json({ player: player.toObject({ getters: true }) });

}*/

// LISÄÄ pelaajan pisteet (AUTH)

const addGoalPoints = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  
  //const goal_makers = [{"name": "Testi pelaaja 1", "points": "3", "id": "1"}, {"name": "Testi pelaaja 2", "points": "1", "id": "2"}, {"name": "Testi pelaaja 3", "points": "5", "id": "3"} ]
  
  //console.log("Tyyppi alustuksessa: " + typeof goal_makers)
  const goal_makers = req.body
  points = goal_makers
  let goalMakerId = 0;


  try {

    console.log(goal_makers)
    for (const key in goal_makers) {
      console.log(key, data[key]);
    }
    
    console.log(goalMakerId)
    //await MySqlGameModel.create(newGame);
  } catch (err) {
    const error = new HttpError(
      "Adding new game failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json("jee");

};

exports.addGoalPoints = addGoalPoints;