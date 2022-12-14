const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const User = MySqlDb.User;

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { firstname, lastname, email, password } = req.body

  let existingUser;
  try {
    existingUser = await User.findByPk(email)

  } catch (err) {
    const error = new HttpError("Signing up failed, plase try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError("Could not create user, pleasy try again.", 500);
    return next(error);
  }

  const createdUser = {
    firstname,
    lastname,
    email,
    password: hashedPassword,
    admin: true
  };

  try {
    await User.create(createdUser);
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again", 500)
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, admin: createdUser.admin },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });

};

const login = async (req, res, next) => {

  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findByPk(email)

  } catch (err) {
    const error = new HttpError("Signing up failed, plase try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    const error = new HttpError("Could not log you in, please check credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, admin: existingUser.admin },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login in failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    admin: existingUser.admin,
    token: token
  });

};

exports.signup = signup;
exports.login = login;