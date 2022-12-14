//This Sequelize Model represents players table in MySQL database. These columns will be generated automatically: id, image, player_name, player_number, position, description,
 //createdAt, updatedAt.

module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    player_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    player_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true

    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });
  
  return Player;
}
