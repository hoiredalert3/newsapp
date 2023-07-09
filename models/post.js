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

    static getSearchVectorName() {
      return 'SearchContent';
    }

    static addSearchIndex() {
      var searchFields = ['title', 'summary', 'content'];
      var vectorName = this.getSearchVectorName();
      sequelize.query(`ALTER TABLE "${Post.tableName}" ADD COLUMN "${vectorName}" TSVECTOR`)
        .then(() => {
          return sequelize.query(`UPDATE "${Post.tableName}" SET "${vectorName}" = to_tsvector('english', '${searchFields.join('\' || \'')}');`).catch(err => console.log(err));
        })
        .then(() => {
          return sequelize.query(`CREATE INDEX post_search_idx ON "${Post.tableName}" USING gin("${vectorName}");`).catch(err => console.log(err));
        })
        .then(() => {
          return sequelize.query(`CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "${Post.tableName}" FOR EACH ROW EXECUTE PROCEDURE
                                 tsvector_update_trigger("${vectorName}", 'pg_catalog.english', ${searchFields.join(', ')})`)
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }
  Post.init(
    {
      authorId: DataTypes.INTEGER,
      title: DataTypes.TEXT,
      summary: DataTypes.TEXT,
      statusId: DataTypes.INTEGER,
      publishedAt: DataTypes.DATE,
      removedAt: DataTypes.DATE,
      thumbnailUrl: DataTypes.TEXT,
      content: DataTypes.TEXT,
      isPremium: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
