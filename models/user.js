"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserType, { foreignKey: "typeId" });
      User.hasMany(models.Post, { foreignKey: "authorId" });
      User.hasMany(models.PostComment, { foreignKey: "userId" });
      User.hasMany(models.RejectedPost, { foreignKey: "reviewerId" });
      User.hasMany(models.ApprovedPost, { foreignKey: "approverId" });
      User.hasMany(models.OTP, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {type: DataTypes.STRING, unique: 'compositeIndex'}, // UNIQUE
      name: DataTypes.STRING,
      email: {type: DataTypes.STRING, unique: 'compositeIndex'},
      dob: DataTypes.DATEONLY,
      pseudonym: DataTypes.STRING,
      managementCategory: DataTypes.INTEGER,
      password: DataTypes.STRING,
      typeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
