//This Sequelize Model represents news table in MySQL database. These columns will be generated automatically: id, header, content, date, createdAt, updatedAt.
module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("news", {
    header: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.DATE
    }
  });

  return News;
};

