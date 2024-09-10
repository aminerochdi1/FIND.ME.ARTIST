'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProfileHasJobs extends Model {

    static associate(models) {
      ProfileHasJobs.belongsTo(models.Profile, { foreignKey: 'profile_id' });
      ProfileHasJobs.belongsTo(models.Job, { foreignKey: 'job_id' });
    }
  }
  ProfileHasJobs.init({
    profile_id: DataTypes.INTEGER,
    job_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProfileHasJobs',
  });
  return ProfileHasJobs;
};