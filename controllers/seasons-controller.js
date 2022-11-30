const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const season = require("../models/season");

// HAKEE KAIKKI KAUDET

const getSeasons = async (req, res, next) => {

  let seasons;

  try {
    seasons = await season.find({season_name: "2022-2023"}).populate("seasonname, game")
  } catch (err) {
    const error = new HttpError("Fetching seasons failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json({ seasons: seasons.map(season => season.toObject({ getters: true })) });
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

  const createdSeason = new season({
    season_name,
    active
  });

  try {
    await createdSeason.save();
  } catch (err) {
    const error = new HttpError(
      "Adding new season failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ season: createdSeason.toObject({ getters: true }) });

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
  let editSeason;

  try {
    editSeason = await season.findById(seasonId);
  } catch (err) {
    const error = new HttpError("Something went wrong. could not find the season by the id", 500
    );
    return next(error);
  }

  editSeason.season_name = season_name,
  editSeason.active = active

try {
    await editSeason.save()
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update season", 500);
    return next(error);
  };

  res.status(200).json({ editSeason: editSeason.toObject({ getters: true }) });

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