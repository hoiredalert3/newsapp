"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OTP.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  OTP.init(
    {
      userId: DataTypes.INTEGER,
      email: DataTypes.STRING,
      signedOTP: DataTypes.STRING,
      encryptedOTP: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "OTP",
    }
  );
  return OTP;
};
