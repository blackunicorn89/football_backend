const express = require("express");
const GamesController = require("../controllers/games-controller")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.put("/:id", checkAuth, GamesController.deleteGame);

module.exports = router;