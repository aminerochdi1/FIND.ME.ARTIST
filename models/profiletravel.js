'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileTravel extends Model {
    
    static associate(models) {
      ProfileTravel.belongsTo(models.Profile, { foreignKey: 'id' });
    }
  }
  ProfileTravel.init({
    profile_id: DataTypes.INTEGER,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfileTravel',
  });
  return ProfileTravel;
};