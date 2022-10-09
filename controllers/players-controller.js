const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const player = require("../models/player");
const Player = require("../models/player");

// LISTAA KAIKKI PELAAJAT

const getPlayers = async (req, res, next) => {

  let players;

  try {
    players = await Player.find()
  } catch (err) {
    const error = new HttpError("Fetching user failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json({ players: players.map(player => player.toObject({ getters: true })) });
};

// HAE PALAAJA ID:N AVULLA 

const getPlayerById = async (req, res, next) => {
  const playerId = req.params.id;
  let player

  try {
    player = await Player.findById(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a player", 500);
    return next(error);
  }

  if (!player) {
    const error = new HttpError("Could not find a player for the provided id.", 404);
    return next(error)
  }

  res.status(200).json({ player: player.toObject({ getters: true }) });

}

// LISÄÄ PELAAJA (AUTH)

const addPlayer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { image, player_name, player_number, position, description } = req.body

  let existingPlayer;
  try {
    existingPlayer = await Player.findOne({ player_number: player_number })
  } catch (err) {
    const error = new HttpError(
      "Adding player failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingPlayer) {
    const error = new HttpError(
      "Player with number" + player_number + " Already exists, try another player number.",
      422
    );
    return next(error);
  }

  let imagePath;

  if (!req.file) {
    imagePath = ""
  }
  else {
    imagePath = req.file.path
  }

  const createdPlayer = new Player({
    image: imagePath,
    player_name,
    player_number,
    position,
    description
  });

  try {
    await createdPlayer.save();
  } catch (err) {
    const error = new HttpError(
      "Adding new player failed, try gain later",
      500
    );
    return next(error);
  }

  res.status(201).json({ player: createdPlayer.toObject({ getters: true }) });

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

exports.getPlayers = getPlayers;
exports.getPlayerById = getPlayerById;
exports.addPlayer = addPlayer;
exports.editPlayer = editPlayer;
exports.deletePlayer = deletePlayer;