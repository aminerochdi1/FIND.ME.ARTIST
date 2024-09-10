'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileSpeaks extends Model {
    
    static associate(models) {
      ProfileSpeaks.belongsTo(models.Profile, { foreignKey: 'id' });
    }
  }
  ProfileSpeaks.init({
    profile_id: DataTypes.INTEGER,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfileSpeaks',
  });
  return ProfileSpeaks;
};