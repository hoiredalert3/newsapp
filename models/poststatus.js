"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostStatus.hasMany(models.Post, { foreignKey: "statusId" });
    }
  }
  PostStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostStatus",
    }
  );
  return PostStatus;
};
