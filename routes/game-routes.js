const express = require("express");
const { check } = require("express-validator")
const GamesController = require("../controllers/games-controller")
const checkAuth = require("../middleware/check-auth")


router = express.Router();

router.get("/", GamesController.getGames);

//router.get("/:id", newsController.findArtcibleById);

router.use(checkAuth);
router.post("/", checkAuth, 
  [
    check("season_name").not().isEmpty(),
    check("game").not().isEmpty(),
    check("final_result").not().isEmpty(),
    check("players").not().isEmpty(),
  ],
  GamesController.addGame);

router.put("/:id", checkAuth,
  [
    check("season_name").not().isEmpty(),
    check("game").not().isEmpty(),
    check("final_result").not().isEmpty(),
    check("players").not().isEmpty(),
  ],
  GamesController.editGame);

router.delete("/:id", checkAuth, GamesController.deleteGame);

module.exports = router;