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
mySQlDb.Session = require("./session.js")(sequelize, Sequelize);

module.exports = mySQlDb;