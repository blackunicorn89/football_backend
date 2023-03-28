const express = require("express");
const { check } = require("express-validator")
const usersControllers = require("../controllers/users-controller")


router = express.Router();

router.get("/getusers", usersControllers.getUsers);

router.post("/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersControllers.signup);

router.delete("/removeuser/:id", usersControllers.removeUser);

router.put("/edituser/:id",
[
  check("firstname").not().isEmpty(),
  check("lastname").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 })
],
usersControllers.editUser);

router.post("/login", usersControllers.login);

module.exports = router;