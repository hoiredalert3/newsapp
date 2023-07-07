"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApprovedPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApprovedPost.belongsTo(models.Post, { foreignKey: "postId" });
      ApprovedPost.belongsTo(models.User, { foreignKey: "approverId" });
    }
  }
  ApprovedPost.init(
    {
      postId: DataTypes.INTEGER,
      approverId: DataTypes.INTEGER,
      approvedAt: DataTypes.DATE,
      publishAt: DataTypes.DATE,
      isPublished: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "ApprovedPost",
    }
  );
  return ApprovedPost;
};
