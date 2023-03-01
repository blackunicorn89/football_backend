const express = require("express");
const { check } = require("express-validator")
const removeGoalPointsController = require("../controllers/removeGoalPoints-controller")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.post("/", checkAuth,
  [
    check("goal_makers").not().isEmpty(),
  ],
  removeGoalPointsController.removeGoalPoints);

module.exports = router;