'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountCode extends Model {

    static associate(models) {
      DiscountCode.belongsTo(models.ProfileHasSubscription, { foreignKey: 'id', targetKey: "discount_id" });
    }
  }
  DiscountCode.init({
    code: DataTypes.STRING,
    reduction: DataTypes.FLOAT,
    expireAt: DataTypes.DATE,
    disabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DiscountCode',
  });
  return DiscountCode;
};