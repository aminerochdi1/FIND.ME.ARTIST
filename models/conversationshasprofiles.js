'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationsHasProfiles extends Model {

    static associate(models) {
      this.belongsTo(models.Conversations, { foreignKey: "conversation_id" })
      this.belongsTo(models.Profile, { foreignKey: "profile_id" })
    }
  }
  ConversationsHasProfiles.init({
    conversation_id: DataTypes.INTEGER,
    profile_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ConversationsHasProfiles',
  });
  return ConversationsHasProfiles;
};