"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostStatistic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostStatistic.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  PostStatistic.init(
    {
      postId: {type: DataTypes.INTEGER, unique: 'compositeIndex'},
      views: DataTypes.INTEGER,
      lastUpdatedHot: DataTypes.DATEONLY,
      hot: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostStatistic",
    }
  );
  return PostStatistic;
};
