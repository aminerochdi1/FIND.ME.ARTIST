'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationsMessage extends Model {

    static associate(models) {
      this.belongsTo(models.Conversations, { foreignKey: "conversation_id" })
      this.belongsTo(models.Profile, { foreignKey: "profile_id" })
    }
  }
  ConversationsMessage.init({
    conversation_id: DataTypes.INTEGER,
    profile_id: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ConversationsMessages',
  });
  return ConversationsMessage;
};