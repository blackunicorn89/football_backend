const express = require("express");
const { check } = require("express-validator")
const SeasonGamesController = require("../controllers/seasonGames-controller")
const checkAuth = require("../middleware/check-auth")


router = express.Router();

router.get("/", SeasonGamesController.getSeasonGames);

//router.get("/:id", newsController.findArtcibleById);

router.use(checkAuth);
router.post("/", checkAuth, 
  [
    check("season_name").not().isEmpty(),
    check("active").not().isEmpty(),
    check("game").not().isEmpty(),
    check("final_result").not().isEmpty(),
    check("players").not().isEmpty(),
  ],
  SeasonGamesController.addSeasonGame);

router.put("/:id", checkAuth,
  [
    check("season_name").not().isEmpty(),
    check("active").not().isEmpty(),
    check("game").not().isEmpty(),
    check("final_result").not().isEmpty(),
    check("players").not().isEmpty(),
  ],
  SeasonGamesController.editSeasonGame);

router.delete("/:id", checkAuth, SeasonGamesController.deleteSeasonGame);

module.exports = router;