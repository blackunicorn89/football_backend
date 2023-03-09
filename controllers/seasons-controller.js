const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const PostgreSqlDb = require("../models");
const Season = PostgreSqlDb.Season;

// HAKEE KAIKKI KAUDET (AUTH)

const getSeasons = async (req, res, next) => {
 
  let seasons;

  try {
    seasons = await Season.findAll({})
  } catch (err) {
    const error = new HttpError("Fetching seasons failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(seasons);
};


// LISÄÄ KAUSI (AUTH)

const addSeason = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }
  const { season_name, active} = req.body
  let existingSeason
  let existingSeasonName = season_name
  try {
    existingSeason = await Season.findAll({attributes: ['season_name']}, {where : { season_name: existingSeasonName }})

  } catch (err) {
    const error = new HttpError("Adding season failed. Pleasy try again later." ,
      500
    );
    return next(error);
  }

  const isFound = existingSeason.some(element => {
    if (element.season_name === existingSeasonName) {
       
      return true;
    }

      return false;

  });

  //Jos Kausi on olemassa, annetaan virhe eikä jatketa eteenpäin kauden tallennukseen.
  if (isFound) {
    const error = new HttpError(
      "Season with the name " + season_name + " Already exists.",
      422
    );
    return next(error);
  }

  const createdSeason = {
    season_name,
    active
  };

  try {
    await Season.create(createdSeason);
  } catch (err) {
    const error = new HttpError(
      "Adding new season failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json(createdSeason);

};

// MUOKKAA KAUDEN TIETOJA (AUTH)

const editSeason = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(
      new HttpError("Invalid inputs passed, check your data.", 422)
    );
  }

  const { season_name, active} = req.body
  const seasonId = req.params.id
  
  const editSeason = {
    season_name,
    active
  }

try {
    await Season.update(editSeason, {where: {id: seasonId}})
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update the season", 500);
    return next(error);
  };

  res.status(200).json(editSeason);

}

// POISTAA KAUDEN (AUTH)

const deleteSeason = async (req, res, next) => {
  const seasonId = req.params.id;

  try {
    removeSeason = await Season.findByPk(seasonId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete the season", 500)
    return next(error)
  }

  if (!removeSeason) {
    const error = new HttpError("Could not find season by this Id", 404);
    return next(error);
  }

  try {
    await Season.destroy({where: {id: seasonId}});
  } catch (err) {
    const error = new HttpError("Removing season failed, please try again", 500)
    return next(error);
  }


  res.status(201).json({ Message: "Season succesfully Removed" });
};

exports.getSeasons = getSeasons;
exports.addSeason = addSeason;
exports.editSeason = editSeason;
exports.deleteSeason = deleteSeason;