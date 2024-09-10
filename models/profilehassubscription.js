'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileHasSubscription extends Model {
    
    static associate(models) {
      ProfileHasSubscription.belongsTo(models.Profile, { foreignKey: 'profile_id' });
      ProfileHasSubscription.belongsTo(models.DiscountCode, { foreignKey: 'discount_id' });
    }
  }
  ProfileHasSubscription.init({
    profile_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
    expireAt: DataTypes.DATE,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProfileHasSubscription',
  });
  return ProfileHasSubscription;
};