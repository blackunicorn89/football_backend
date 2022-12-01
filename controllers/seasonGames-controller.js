const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const seasonGame = require("../models/seasonGame");
const seasonModel = require("../models/season");
const mongoose = require('mongoose');



// LISTAA KAIKKI KAUDEN PELIT

const getSeasonGames = async (req, res, next) => {

  let seasonGames;

  try {
    seasonGames = await seasonGame.find().populate({path:"season", model:"Season"})
  } catch (err) {
    const error = new HttpError("Fetching season's games failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json({ seasonGames: seasonGames.map(seasonGame => seasonGame.toObject({ getters: true })) });
};

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

// LISÄÄ PELI KAUTEEN (AUTH)

const addSeasonGame = async (req, res, next) => {
  const errors = validationResult(req);
  const toId = mongoose.Types.ObjectId
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { season_name, active, game, final_result, players, goal_makers, description } = req.body
  let gameSeason = toId
  
  /*let seasons;
  seasons = await seasonModel.find({season_name: season_name})
  console.log(season_name)
  gameSeason = toId(seasons)
  console.log ("Testi")
  console.log("muuttuuko numeroks")
  console.log(gameSeason)
  */
 season = "63889bba66bfaeb95ccf21e7"
 

  const createdSeasonGame = new seasonGame({
    //season_name,
    season,
    active,
    game,
    final_result,
    players,
    goal_makers,
    description
  });

  try {
    await createdSeasonGame.save();
  } catch (err) {
    const error = new HttpError(
      "Adding new season game failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ seasonGame: createdSeasonGame.toObject({ getters: true }) });

};

// MUOKKAA KAUDEN PELIN TIETOJA (AUTH)

const editSeasonGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(
      new HttpError("Invalid inputs passed, check your data.", 422)
    );
  }

  const { season_name, active, game, final_result, players, goal_makers, description } = req.body
  const seasonGameId = req.params.id
  let season_Game;

  try {
    season_Game = await seasonGame.findById(seasonGameId);
  } catch (err) {
    const error = new HttpError("Something went wrong. could not find the season's game by the id", 500
    );
    return next(error);
  }

  season_Game.season_name = season_name,
  season_Game.active = active,
  season_Game.game = game,
  season_Game.final_result = final_result,
  season_Game.players = players,
  season_Game.goal_makers = goal_makers,
  season_Game.description = description

  try {
    await season_Game.save()
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update season's game", 500);
    return next(error);
  };

  res.status(200).json({ season_Game: season_Game.toObject({ getters: true }) });

}

// POISTAA KAUDEN PELI (AUTH)

const deleteSeasonGame = async (req, res, next) => {
  const seasonGameId = req.params.id;
  let season_Game;

  try {
    season_Game = await seasonGame.findById(seasonGameId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete season's game", 500)
    return next(error)
  }

  if (!season_Game) {
    const error = new HttpError("Could not find season's game by this Id", 404);
    return next(error);
  }

  try {
    await season_Game.deleteOne();
  } catch (err) {
    const error = new HttpError("Removing season's game failed, please try again", 500)
    return next(error);
  }


  res.status(201).json({ Message: "Season's game succesfully Removed" });
};

exports.getSeasonGames = getSeasonGames;
//exports.getPlayerById = getPlayerById;
exports.addSeasonGame = addSeasonGame;
exports.editSeasonGame = editSeasonGame;
exports.deleteSeasonGame = deleteSeasonGame;