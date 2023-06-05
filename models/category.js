"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.Post, {
        through: "PostCategory",
        foreignKey: "categoryId",
        otherKey: "postId",
      });

      Category.belongsTo(models.Category, { foreignKey: "parentId" });
      Category.hasMany(models.Category, { foreignKey: "parentId" });
    }
  }
  Category.init(
    {
      removedAt: DataTypes.DATE,
      parentId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
