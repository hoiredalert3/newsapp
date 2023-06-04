"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentStatus.hasMany(models.PostComment, { foreignKey: "statusId" });
    }
  }
  CommentStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CommentStatus",
    }
  );
  return CommentStatus;
};
