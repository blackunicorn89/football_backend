const mySqlDbConfig = require("../config/mysqldb.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(mySqlDbConfig.DB, mySqlDbConfig.USER, mySqlDbConfig.PASSWORD, {
  host: mySqlDbConfig.HOST,
  dialect: mySqlDbConfig.dialect,
  operatorsAliases: 0,

 
  }
);

const mySQlDb = {};

mySQlDb.Sequelize = Sequelize;
mySQlDb.sequelize = sequelize;

mySQlDb.News = require("./news.js")(sequelize, Sequelize);
mySQlDb.User = require("./user.js")(sequelize, Sequelize);
mySQlDb.Player = require("./player.js")(sequelize, Sequelize);
mySQlDb.Season = require("./season.js")(sequelize, Sequelize);
mySQlDb.Game = require("./game.js")(sequelize, Sequelize);

mySQlDb.Season.hasMany(mySQlDb.Game, {
  foreignKey: "season_name",
  sourceKey: "season_name"
});
mySQlDb.Game.belongsTo(mySQlDb.Season, {
  foreignKey: "season_name",
  targetKey: "season_name"
});


module.exports = mySQlDb;