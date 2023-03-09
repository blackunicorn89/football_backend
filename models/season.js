//This Sequelize Model represents season table in PostgreSQL database. These columns will be generated automatically: id, season, active, createdAt, updatedAt.
module.exports = (sequelize, Sequelize) => {
  const Season = sequelize.define("season", {
    season_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true

    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false, 
    },

  });

 return Season;
};


