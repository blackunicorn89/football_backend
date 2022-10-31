const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const seasonGame = require("../models/seasonGame");

// LISTAA KAIKKI KAUDEN PELIT

const getSeasonGames = async (req, res, next) => {

  let seasonGames;

  try {
    seasonGames = await seasonGame.find()
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
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { season_name, active, game, final_result, players, goal_makers, description } = req.body

  const createdSeasonGame = new seasonGame({
    season_name,
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
      "Adding new season game failed, try gain later",
      500
    );
    return next(error);
  }

  res.status(201).json({ seasonGame: createdSeasonGame.toObject({ getters: true }) });

};

// MUOKKAA PALAAJAA (AUTH) *Kuvan vaihtaminen tarkistamatta!!!

const editPlayer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(
      new HttpError("Invalid inputs passed, check your data.", 422)
    );
  }

  const { player_name, player_number, position, description } = req.body
  const playerId = req.params.id
  let playerImagePath;
  let player;

  try {
    player = await Player.findById(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong. could not update", 500
    );
    return next(error);
  }

  if (!req.file) {
    playerImagePath = player.image
  }
  else {
    playerImagePath = req.file.path
    fs.unlink(player.image, (err) => {
      console.log(err)
    });
  }

  player.image = playerImagePath;
  player.player_name = player_name;
  player.player_number = player_number;
  player.position = position;
  player.description = description;

  try {
    await player.save()
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update player", 500);
    return next(error);
  };

  res.status(200).json({ player: player.toObject({ getters: true }) });

}

// POISTA PELAAJA (AUTH)

const deletePlayer = async (req, res, next) => {
  const playerId = req.params.id;
  let player;

  try {
    player = await Player.findById(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete player", 500)
    return next(error)
  }

  if (!player) {
    const error = new HttpError("Could not find player for this Id", 404);
    return next(error);
  }

  try {
    await player.deleteOne();
  } catch (err) {
    const error = new HttpError("Removing player failed, please try again", 500)
    return next(error);
  }

  fs.unlink(player.image, err => {
    console.log(err)
  });

  res.status(201).json({ Message: "Player succesfully Removed" });
};

exports.getSeasonGames = getSeasonGames;
//exports.getPlayerById = getPlayerById;
exports.addSeasonGame = addSeasonGame;
exports.editPlayer = editPlayer;
exports.deletePlayer = deletePlayer;