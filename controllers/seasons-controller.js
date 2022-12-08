const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const Season = MySqlDb.Season;

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
  try {
    existingSeason = await Season.findByPk(season_name)

  } catch (err) {
    const error = new HttpError("Adding season failed. Pleasy try again later." ,
      500
    );
    return next(error);
  }

  if (existingSeason) {
    const error = new HttpError(
      "Season with name " + season_name + " already exist.",
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
  const seasonName = season_name
  let currentSeason

  try {
    currentSeason = await Season.findByPk(seasonName);
    console.log(currentSeason)
  } catch (err) {
    const error = new HttpError("Something went wrong. could not find the season by the name", 500
    );
    return next(error);
  }

  const editSeason = {
    active
  }

try {
    await Season.update(editSeason, {where: {season_name: seasonName}})
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update the season", 500);
    return next(error);
  };

  res.status(200).json(editSeason);

}

// POISTAA KAUDEN (AUTH)

const deleteSeason = async (req, res, next) => {
  const seasonId = req.params.id;
  let removeSeason;

  try {
    removeSeason = await season.findById(seasonId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete season's game", 500)
    return next(error)
  }

  if (!removeSeason) {
    const error = new HttpError("Could not find season by this Id", 404);
    return next(error);
  }

  try {
    await removeSeason.deleteOne();
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