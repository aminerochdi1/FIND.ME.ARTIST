'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileDontTravel extends Model {
    
    static associate(models) {
      ProfileDontTravel.belongsTo(models.Profile, { foreignKey: 'id' });
    }
  }
  ProfileDontTravel.init({
    profile_id: DataTypes.INTEGER,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfileDontTravel',
  });
  return ProfileDontTravel;
};