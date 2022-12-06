module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("session", {
    user: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
    },
    ttl: {
      type: Sequelize.INTEGER,
    }
  });

  return Session;
};


/*const mongoose = require("mongoose");

let Schema = mongoose.Schema({
  user: { type: String, index: true },
  token: String,
  ttl: Number
})

module.exports = mongoose.model("Session", Schema);*/