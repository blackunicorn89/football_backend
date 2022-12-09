
/*const seasonSchema = new Schema({
  season_name: {type: String, unique: true},
  active: Boolean,
  seasongame: [{type: Schema.Types.ObjectId, ref: 'SeasonGame'}]
});*/

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

/*const gameOfSeasonSchema = Schema({
  _id: Schema.Types.ObjectId,
  season_name: {type: String, unique: true},
  active: boolean,
  season_games: [{ type: Schema.Types.ObjectId, ref: 'seasongames' }]
});*/

//seasonSchema.plugin(uniqueValidator);

//module.exports = mongoose.model("Season", seasonSchema);

