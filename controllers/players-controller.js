const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Player = require("../models/player");

// GET ALL PLAYERS

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

// LISÄÄ PELAAJA

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

  const createdPlayer = new Player({
    image: req.file.path,
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



exports.getPlayers = getPlayers;
exports.addPlayer = addPlayer;