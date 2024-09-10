'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Body extends Model {
    
    static associate(models) {
      this.belongsTo(models.Profile, { foreignKey: 'id' });
    }
  }
  Body.init({
    profile_id: DataTypes.INTEGER,
    ethnic: DataTypes.INTEGER,
    hair: DataTypes.INTEGER,
    eyes: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    bust: DataTypes.INTEGER,
    hip: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    waist: DataTypes.INTEGER,
    shoe: DataTypes.INTEGER,
    tattoo: DataTypes.BOOLEAN,
    body_modification: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Body',
  });
  return Body;
};