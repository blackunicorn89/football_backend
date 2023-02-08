const PostgresSqlDbConfig = require("../config/postgressqldb.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(PostgresSqlDbConfig.DB, PostgresSqlDbConfig.USER, PostgresSqlDbConfig.PASSWORD, {
  host: PostgresSqlDbConfig.HOST,
  dialect: PostgresSqlDbConfig.dialect,
  operatorsAliases: 0,

 
  }
);

const postgresSQlDb = {};

postgresSQlDb.Sequelize = Sequelize;
postgresSQlDb.sequelize = sequelize;

postgresSQlDb.News = require("./news.js")(sequelize, Sequelize);
postgresSQlDb.User = require("./user.js")(sequelize, Sequelize);
postgresSQlDb.Player = require("./player.js")(sequelize, Sequelize);
postgresSQlDb.Season = require("./season.js")(sequelize, Sequelize);
postgresSQlDb.Game = require("./game.js")(sequelize, Sequelize);

//Creates assosiacation between the tables season and game
postgresSQlDb.Season.hasMany(postgresSQlDb.Game, {
  foreignKey: "season_name",
  sourceKey: "season_name"
});
postgresSQlDb.Game.belongsTo(postgresSQlDb.Season, {
  foreignKey: "season_name",
  targetKey: "season_name"
});


module.exports = postgresSQlDb;