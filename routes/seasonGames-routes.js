const express = require("express");
const SeasonGamesController = require("../controllers/seasongames-controller")

router = express.Router();

router.get("/", SeasonGamesController.getSeasonGames);

module.exports = router;