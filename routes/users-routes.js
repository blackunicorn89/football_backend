const express = require("express");
const { check } = require("express-validator")
const usersControllers = require("../controllers/users-controller")


router = express.Router();

router.post("/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;