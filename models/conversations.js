'use strict';
const {
  Model, Op
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {

    static associate(models) {
      this.hasMany(models.ConversationsHasProfiles, { foreignKey: "conversation_id" })
      this.hasMany(models.ConversationsMessages, { foreignKey: "conversation_id" })
    }

    async listProfiles() {
      try {
        const profiles = await this.getConversationsHasProfiles({
          include: [
            {
              model: sequelize.models.Profile
            }
          ]
        });

        return profiles.map((profile) => { return profile.Profile; });
      } catch (error) {
        console.error('Error adding profile to conversation:', error);
        throw error;
      }
    }

    async addProfile(profile_id) {
      try {
        const conversationHasProfile = await this.createConversationsHasProfile({
          profile_id: profile_id
        });

        return conversationHasProfile;
      } catch (error) {
        console.error('Error adding profile to conversation:', error);
        throw error;
      }
    }

    async sendMessage(profile_id, message) {
      try {
        const conversationHasProfile = await this.createConversationsMessage({
          profile_id: profile_id,
          message: message
        });

        return conversationHasProfile;
      } catch (error) {
        console.error('Error sending message to conversation:', error);
        throw error;
      }
    }

    async countMessages() {
      return await this.sequelize.models.ConversationsMessages.count({
        where: {
          conversation_id: this.id
        }
      })
    }

    async listMessages() {
      return await this.listMessages(undefined);
    }

    async listMessages(from) {
      var where = {}
      if (from != undefined) {
        where = {
          id: {
            [Op.lte]: from
          }
        }
      }
      try {
        const messages = await this.getConversationsMessages({
          limit: 20,
          where,
          order: [[
            "id", "DESC"
          ]],
          include: [
            {
              model: sequelize.models.Profile,
              attributes: ["id", "firstname", "lastname", "gender", "picture_id"]
            }
          ]
        });

        return messages;
      } catch (error) {
        console.error('Error list messages from conversation:', error);
        throw error;
      }
    }
  }
  Conversations.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversations',
  });
  return Conversations;
};