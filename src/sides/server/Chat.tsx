import { ProfileBuilder } from "../../builders/ProfileBuilder";
import ConversationMessage from "../../classes/conversations/ConversationMessage";
import ConversationProfile from "../../classes/conversations/ConversationProfile";
import DuoConversation from "../../classes/conversations/DuoConversation";
import { Op } from "sequelize";
import SessionHandler from "./SessionHandler";
import checkerUtils from "../../utils/checker.utils";
import ProfileHandler from "./ProfileHandler";
import { profile } from "console";

const { Sequelize, Conversations, Profile, ConversationsHasProfiles, ConversationsMessages } = require('../../../models');

export default class Chat {

    /*
    * Cette fonction n'est pas forcement très optimiser dans le sens si l'utilisateur 
    * a beaucoup de conversation. Celle-ci pourrait être réduite à une seule requête
    */
    public static async hasMessages(profile_id: any) {
        const conversations = await ConversationsHasProfiles.findAll({
            where: {
                profile_id
            }
        })

        let count_ = 0;
        for(const conversation of conversations) {
            count_ += await ConversationsMessages.count({
                where: {
                    read: false,
                    conversation_id: conversation.conversation_id,
                    profile_id: {
                        [Op.not]: profile_id
                    }
                }
            })
        }
        return count_;
    }

    /*
    * Cette fonction va permettre de récupérer un message envoyer par l'interlocuteur du 'profile_id' (donc pas lui)
    * pour cela il faut récupérer l'id de la conversation, du message et bien-sûr le profile_id de celui-ci qui a
    * reçu ce message.
    */
    public static async getMessageWithConversationId(conversation_id: number, profile_id: number, message_id: number) {
        const conversation = await Conversations.findOne({
            where: {
                id: conversation_id
            },
            include: [
                {
                    model: ConversationsHasProfiles,
                    where: {
                        profile_id
                    }
                }
            ]
        })
        if(conversation == undefined) return null;
        const message = await ConversationsMessages.findOne({
            where: {
                conversation_id: conversation_id,
                id: message_id,
                profile_id: {
                    [Op.not]: profile_id
                }
            }
        })
        return message;
    }

    /*
    * Cette fonction récupère le message qui à été envoyé par un utilisateur 'profile_id',
    * pour cela il faut indiquer le profile_id et bien sur l'id du message
    */
    public static async getMessage(profile_id: number, message_id: number) {
        const message = await ConversationsMessages.findOne({
            where: {
                id: message_id,
                profile_id
            }
        })
        return message;
    }

    /*
    * Cette fonction repertorie toute les conversations créer et qui sont en lien avec
    * l'utilisateur profile_id
    */
    public static async listConversations(profile_id: number) {
        const conversations = await ConversationsHasProfiles.findAll({
            where: { profile_id },
            attributes: ["conversation_id"],
            include: [
                {
                    model: Conversations,
                    attributes: ["id"],
                    include: [
                        {
                            attributes: ["profile_id"],
                            model: ConversationsHasProfiles,
                            where: {
                                profile_id: {
                                    [Op.not]: profile_id
                                }
                            }
                        }
                    ]
                }
            ]
        })
        let conversations_: DuoConversation[] = [];
        for (const conversation of conversations) {
            conversations_ = [...conversations_, await Chat.buildConversation(conversation.Conversation)]
        }
        return conversations_;
    }

    /*
    * Cette fonction permet de créer une conversation et de lier tout les utilisateurs
    * qui sont répertorié dans la liste des profiles_id
    */
    public static async createConversation(profiles_id: number[]) {
        const conversation = await Conversations.create({ name: undefined });
        try {
            profiles_id.map((profile) => {
                conversation.addProfile(profile)
            })
            return conversation;
        } catch (error) {
            console.error(error)
            conversation.destroy();
        }
        return null;
    }

    /*
    * Cette fonction permet de récupérer les conversations qui sont en lien 
    * avec tout les utilisateurs répertorié dans 'profiles_id'
    */
    public static async getConversationsByProfilesId(profiles_id: number[]) {
        const conversations = Conversations.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: ConversationsHasProfiles,
                where: { profile_id: profiles_id }
            }],
            group: ['Conversations.id', 'Conversations.name'],
            having: Sequelize.literal(`COUNT(DISTINCT ConversationsHasProfiles.profile_id) = ${profiles_id.length}`)
        })
        return conversations;
    }

    /*
    * Cette fonction permet de construire une conversation sous forme d'objet 
    */
    public static async buildConversation(conversation: any,) {
        const target = await Profile.findOne({ where: { id: conversation.ConversationsHasProfiles[0].profile_id } });
        const has_messages = await Conversations.count({
            where: {
                id: conversation.id
            },
            include: [
                {
                    model: ConversationsMessages,
                    where: {
                        profile_id: target.id,
                        read: false
                    }
                }
            ],
        })
        let target_conversation_profile = await ProfileBuilder.build(target);
        // target_conversation_profile.id = conversation.ConversationsHasProfiles[0].id;

        const lastMessage = undefined;

        return new DuoConversation(conversation.id, target_conversation_profile, lastMessage, has_messages);
    }

    /*
    * Permet de récupérer la conversation qui est en lien avec un utilisateur sous forme d'objet
    */
    public static async getConversation(profile_id: number, conversation_id: number) {
        const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
        return await this.buildConversation(conversation);
    }

    public static async getConversationByProfile(profile_id: number, conversation_id: number) {
        const conversation = await Conversations.findOne({
            where: { id: conversation_id },
            attributes: ['id', 'name'],
            include: [{
                model: ConversationsHasProfiles,
                where: { profile_id }
            }]
        })
        return conversation;
    }

    public static async getConversationByInterlocutor(profile_id: number, conversation_id: number) {
        const conversation = await ConversationsHasProfiles.findOne({
            where: { profile_id, conversation_id },
            attributes: ["conversation_id"],
            include: [
                {
                    model: Conversations,
                    attributes: ["id"],
                    include: [
                        {
                            attributes: ["profile_id"],
                            model: ConversationsHasProfiles,
                            where: {
                                profile_id: {
                                    [Op.not]: profile_id
                                }
                            }
                        }
                    ]
                }
            ]
        })
        if (conversation == undefined) return undefined;
        return await this.buildConversation(conversation.Conversation);
    }

    public static async listMessages(profile_id: number, conversation_id: number) {
        const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
        return await Chat.listMessagesFromConversation(conversation);
    }

    public static async listMessagesFromConversation(conversation: any, from?: number, profile_id?: number) {
        const messages = await conversation.listMessages(from);
        let messages_: ConversationMessage[] = [];

        let i = 0;
        for (const message of messages) {
            /*
            if (profile_id != undefined && message.profile_id != profile_id && !message.read) {
                await message.update({ read: true });
            }*/
            const profile = message.Profile;
            const conversation_profile = new ConversationProfile(profile.id, profile.picture_id, profile.firstname, profile.lastname, profile.gender);
            await conversation_profile.fetchProfilePicture();
            messages_ = [...messages_, new ConversationMessage(message.id, Number.parseInt(conversation.id), conversation_profile, message.message, message.createdAt, message.read, i == 0)]
            i++;
        }
        return await messages_;
    }

    public static async storeMessage(profile_id: number, conversation_id: number, message: string) {
        const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
        return await Chat.storeMessageToConversation(conversation, profile_id, message);
    }

    public static async storeMessageToConversation(conversation: any, profile_id: number, message: string) {
        return await conversation.sendMessage(profile_id, message);
    }

    public static async openConversation(profile_id: number, target_id: number) {
        // certains ne sont pas défini correctement
        if (await checkerUtils.missingParameters(profile_id, target_id))
            return false;

        // certains ne sont pas défini comme il faut 
        const errors = await checkerUtils.errors({ profile_id, target_id });
        if (errors.length > 0)
            return false;

        const conversations = await Chat.getConversationsByProfilesId([profile_id, target_id]);
        if (conversations.length > 0) {
            return conversations[0].id;
        } else {
            const target_profile = await ProfileHandler.getProfileById(target_id);
            if (target_profile != null) {
                const { id } = await Chat.createConversation([profile_id, target_id])
                return id;
            }
        }
        return false;
    }

    public static async sendMessage(token: string, conversation_id: number, message: string) {
        try {
            // certains ne sont pas défini correctement
            if (await checkerUtils.missingParameters(token, conversation_id, message))
                return false;

            // certains ne sont pas défini comme il faut 
            const errors = await checkerUtils.errors({ token, conversation_id, message });
            if (errors.length > 0)
                return false;

            const { success, message: message_, user } = await SessionHandler.checkSession(token);
            if (success) {
                const profile = await user.getProfile();
                const profile_id = profile.id;
                const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
                // 404 Not Found conversation
                if (conversation == null)
                    return false;

                const conversationMessage = await Chat.storeMessageToConversation(conversation, profile_id, message);
                const success = conversationMessage != undefined;

                const message_id = conversationMessage.id;

                if (success) {
                    const conversationProfile = new ConversationProfile(profile_id, profile.picture_id, profile.firstname, profile.lastname, profile.gender);
                    conversationProfile.fetchProfilePicture();
                    const conversationMessage = new ConversationMessage(message_id, conversation_id, conversationProfile, message, new Date(), false, true)
                    return conversationMessage;
                }
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }
}