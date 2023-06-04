"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Post, {
        through: "PostTag",
        foreignKey: "tagId",
        otherKey: "postId",
      });
    }
  }
  Tag.init(
    {
      removedAt: DataTypes.DATE,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
