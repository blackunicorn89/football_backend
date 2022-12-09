const express = require("express");
const { check } = require("express-validator")
const SeasonsController = require("../controllers/seasons-controller")
const checkAuth = require("../middleware/check-auth")


router = express.Router();



router.use(checkAuth);
router.get("/", checkAuth, SeasonsController.getSeasons);

router.post("/", checkAuth, 
  [
    check("season_name").not().isEmpty(),
    check("active").not().isEmpty()
  ],
  SeasonsController.addSeason);

router.put("/:id", checkAuth,
  [
    check("season_name").not().isEmpty(),
    check("active").not().isEmpty()
  ],
  SeasonsController.editSeason);

router.delete("/:id", checkAuth, SeasonsController.deleteSeason);

module.exports = router;