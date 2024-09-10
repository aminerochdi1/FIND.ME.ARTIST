'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {

    static associate(models) {
      this.belongsToMany(models.Profile, { through: 'ProfileHasJob' });
    }
  }
  Job.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};