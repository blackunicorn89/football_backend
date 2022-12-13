const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const MySqlGameModel = MySqlDb.Game;


// LISTAA KAIKKI KAUDEN PELIT

const getGames = async (req, res, next) => {

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

const addGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { season_name , game, played, final_result, players, goal_makers, description } = req.body
  
  const newGame = {
    season_name,
    game,
    played,
    final_result,
    players,
    goal_makers,
    description
  };

  try {
    await MySqlGameModel.create(newGame);
  } catch (err) {
    const error = new HttpError(
      "Adding new game failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json(newGame);

};

// MUOKKAA KAUDEN PELIN TIETOJA (AUTH)

const editGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(
      new HttpError("Invalid inputs passed, check your data.", 422)
    );
  }

  const { season_name, game, played, final_result, players, goal_makers, description } = req.body
  const gameId = req.params.id
  let editGame;

  editGame = {
    season_name,
    game,
    played,
    final_result,
    players,
    goal_makers,
    description
  }

  try {
    await MySqlGameModel.update(editGame, {where: {id: gameId}})
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update the game", 500);
    return next(error);
  };

  res.status(200).json(editGame);

}

// POISTAA KAUDEN PELI (AUTH)

const deleteGame = async (req, res, next) => {
  const gameId = req.params.id;

  try {
    await MySqlGameModel.destroy({where:{id: gameId}});
  } catch (err) {
    const error = new HttpError("Removing season's game failed, please try again", 500)
    return next(error);
  }


  res.status(201).json({ Message: "Game succesfully Removed" });
};

exports.getGames = getGames;
//exports.getPlayerById = getPlayerById;
exports.addGame = addGame;
exports.editGame = editGame;
exports.deleteGame = deleteGame;