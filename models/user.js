const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//This Sequelize Model represents user table in MySQL database. These columns will be generated automatically: id, header, content, date, createdAt, updatedAt.
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true

    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    }
  });

  return User;
};


/*const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  admin: { type: Boolean }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);*/