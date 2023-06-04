"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostImage.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  PostImage.init(
    {
      postId: DataTypes.INTEGER,
      caption: DataTypes.TEXT,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostImage",
    }
  );
  return PostImage;
};
