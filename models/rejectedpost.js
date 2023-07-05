"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RejectedPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RejectedPost.belongsTo(models.Post, { foreignKey: "postId" });
      RejectedPost.belongsTo(models.User, { foreignKey: "reviewerId" });
    }
  }
  RejectedPost.init(
    {
      postId: DataTypes.INTEGER,
      reviewerId: DataTypes.INTEGER,
      reviewedAt: DataTypes.DATE,
      categoryComment: DataTypes.TEXT,
      tagComment: DataTypes.TEXT,
      titleComment: DataTypes.TEXT,
      abstractComment: DataTypes.TEXT,
      contentComment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "RejectedPost",
    }
  );
  return RejectedPost;
};
