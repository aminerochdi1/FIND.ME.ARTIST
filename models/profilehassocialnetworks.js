'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileHasSocialNetworks extends Model {
    
    static associate(models) {
      ProfileHasSocialNetworks.belongsTo(models.Profile, { foreignKey: 'id' });
    }
  }
  ProfileHasSocialNetworks.init({
    profile_id: DataTypes.INTEGER,
    socialnetwork: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfileHasSocialNetworks',
  });
  return ProfileHasSocialNetworks;
};