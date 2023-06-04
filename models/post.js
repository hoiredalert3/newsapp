"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: "authorId" });
      Post.belongsTo(models.PostStatus, { foreignKey: "statusId" });
      Post.belongsToMany(models.Tag, {
        through: "PostTag",
        foreignKey: "postId",
        otherKey: "tagId",
      });
      Post.belongsToMany(models.Category, {
        through: "PostCategory",
        foreignKey: "postId",
        otherKey: "categoryId",
      });

      Post.hasMany(models.RejectedPost, { foreignKey: "postId" });
      Post.hasOne(models.ApprovedPost, { foreignKey: "postId" });
      Post.hasOne(models.PostStatistic, { foreignKey: "postId" });
      Post.hasMany(models.PostImage, { foreignKey: "postId" });
      Post.hasMany(models.PostComment, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      authorId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      summary: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      publishedAt: DataTypes.DATE,
      removedAt: DataTypes.DATE,
      thumnailUrl: DataTypes.STRING,
      contentUrl: DataTypes.STRING,
      isPremium: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
