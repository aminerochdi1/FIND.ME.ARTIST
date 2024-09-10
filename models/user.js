'use strict';

const { Model } = require('sequelize');
const { Session } = require('./session');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsTo(models.Profile, { foreignKey: 'profile_id', targetKey: "id", as: 'profil' });
      this.hasMany(models.Session, { foreignKey: 'user_id' });
    }

    async getProfileAttributes(attributes) {
      try {
        return await this.getProfil({attributes}  );
      } catch (error) {
        console.error(error)
      }
    }

    async getProfile() {
      try {
        return await this.getProfil({attributes: { exclude: ["profile_id"]}}  );
      } catch (error) {
        console.error(error)
      }
    }
  }


  User.init({
    profile_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    confirmation_token: DataTypes.STRING,
    password_forget_token: DataTypes.STRING,
    language: DataTypes.STRING,
    banned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};