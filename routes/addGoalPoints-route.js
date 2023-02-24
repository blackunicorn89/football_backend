const express = require("express");
const { check } = require("express-validator")
const addGoalPointsController = require("../controllers/addGoalPoints-controller")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.post("/", checkAuth,
  [
    check("goal_makers").not().isEmpty(),
  ],
  addGoalPointsController.addGoalPoints);

module.exports = router;