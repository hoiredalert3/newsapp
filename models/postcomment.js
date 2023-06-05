"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostComment.belongsTo(models.User, { foreignKey: "userId" });
      PostComment.belongsTo(models.Post, { foreignKey: "postId" });
      PostComment.belongsTo(models.CommentStatus, { foreignKey: "statusId" });
      PostComment.belongsTo(models.PostComment, {
        foreignKey: "parentId",
      });
      PostComment.hasMany(models.PostComment, {
        foreignKey: "parentId",
      });
    }
  }
  PostComment.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      parentId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      publishedAt: DataTypes.DATE,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostComment",
    }
  );
  return PostComment;
};
