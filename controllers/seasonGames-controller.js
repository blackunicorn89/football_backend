const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const Season = MySqlDb.Season;

// HAKEE KAIKKI KAUDET (AUTH)

const getSeasonGames = async (req, res, next) => {
 
  let seasonGames;

  try {
    seasonGames = await Season.findAll({ include: ["games"] })
  } catch (err) {
    const error = new HttpError("Fetching seasons failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(seasonGames);
};
exports.getSeasonGames = getSeasonGames;


