const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const Player = MySqlDb.Player;


// LISTAA KAIKKI PELAAJAT

const getPlayers = async (req, res, next) => { 

  let players;

  try {
    players = await Player.findAll({})
  } catch (err) {
    const error = new HttpError("Fetching players failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(players);
};

// HAE PALAAJA ID:N AVULLA. Tarvitaanko? Jos, niin mihin?

/*const getPlayerById = async (req, res, next) => {
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

}*/

// LISÄÄ PELAAJA (AUTH)

const addPlayer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { player_name, player_number, position, description } = req.body

  let existingPlayer;
  let existingPlayerNumber =  parseInt(player_number)
  try {
    existingPlayer = await Player.findAll({attributes: ['player_number']}, {where : { player_number: existingPlayerNumber }})
  } catch (err) {
    const error = new HttpError(
      "Adding player failed, please try again later",
      500
    );
    return next(error);
  }

  //Tarkistetaanko löytyyko palautetusta objektitaulukosta pelaajanumero. Jos löytyy palautetaan false, jos ei löydy palautetaan false 
  const isFound = existingPlayer.some(element => {
    if (element.player_number === existingPlayerNumber) {
       
      return true;
    }

      return false;

  });

  //Jos pelaajanumero on olemassa, annetaan virhe eikä jatketa eteenpäin pelaajan tallennukseen.
  if (isFound) {
    const error = new HttpError(
      "Player with number " + player_number + " Already exists, try another player number.",
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
   
  const createdPlayer = {
    image: imagePath,
    player_name,
    player_number,
    position,
    description
  };

  try {
    await Player.create(createdPlayer);
    console.log("toimii")
  } catch (err) {
    const error = new HttpError(
      "Adding new player failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json(createdPlayer);

};

// MUOKKAA PELAAJAA (AUTH) *Kuvan vaihtaminen tarkistamatta!!!

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
    player = await Player.findByPk(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong. could not update the player information", 500
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

  const editedPlayer = {
  playerImagePath,
  player_name,
  player_number,
  position,
  description
  }

  try {
    await Player.update(editedPlayer, {where: {id: playerId}})
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update player", 500);
    return next(error);
  };

  res.status(200).json(editedPlayer);

}

// POISTA PELAAJA (AUTH)

const deletePlayer = async (req, res, next) => {
  const playerId = req.params.id;
  let player;

  try {
    player = await Player.findByPk(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete player", 500)
    return next(error)
  }

  if (!player) {
    const error = new HttpError("Could not find player for this Id", 404);
    return next(error);
  }

  try {
    await Player.destroy({where: {id: playerId}});
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
//exports.getPlayerById = getPlayerById;
exports.addPlayer = addPlayer;
exports.editPlayer = editPlayer;
exports.deletePlayer = deletePlayer;