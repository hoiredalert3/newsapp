"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      PostCategory.belongsTo(models.Category, { foreignKey: "categoryId" });
      PostCategory.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  PostCategory.init(
    {
      // postId: DataTypes.INTEGER,
      // categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostCategory",
    }
  );
  return PostCategory;
};
