//This Sequelize Model represents user table in PostgreSQL database. These columns will be generated automatically: id, firstname, lastname, email, password, admin, createdAt, updatedAt.
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
