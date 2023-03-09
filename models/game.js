//This Sequelize Model represents game table in PostgreSQL database. These columns will be generated automatically: id, season_name, game, played, final_result,
//players, goal_makers, description, createdAt, updatedAt.
module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("game", {
    season_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    game: {
      type: Sequelize.STRING,
      allowNull: false
    },
    played: {
      type: Sequelize.DATE,
      allowNull: false
    },
    final_result: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    players: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    goal_makers: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  
  return Game;
}




