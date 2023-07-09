"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PremiumDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PremiumDetails.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PremiumDetails.init(
    {
      userId: DataTypes.INTEGER,
      validUntil: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PremiumDetails",
    }
  );
  return PremiumDetails;
};
