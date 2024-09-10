'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdsHasJobs extends Model {

    static associate(models) {
      AdsHasJobs.belongsTo(models.Ads, { foreignKey: 'ad_id' });
      AdsHasJobs.belongsTo(models.Job, { foreignKey: 'job_id' });
    }
  }
  AdsHasJobs.init({
    ad_id: DataTypes.INTEGER,
    job_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdsHasJobs',
  });
  return AdsHasJobs;
};