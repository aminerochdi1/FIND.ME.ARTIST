import DuoConversation from "@/classes/conversations/DuoConversation";
import config from "../config.json"
import ConversationMessage from "@/classes/conversations/ConversationMessage";

export default class ChatAPI {

    public static async listConversations(token: string) {
        let parameters: any = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        }
        const res = await fetch(config.API + '/chat/conversations', parameters)
        const data = await res.json();
        var conversations: DuoConversation[] = data.conversations;

        return conversations;
    }

    public static async getRecentsMessagesOfConversation(token: string, conversation_id: number, from?: number) {
        let parameters: any = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        }       
        const res = await fetch(config.API + '/chat/messages/list?conversation_id=' + conversation_id + (from !== undefined ? "&from="+from : ""), parameters)
        const data = await res.json();;

        return data;
    }

    public static async sendMessageToConversation(token: string, conversation_id: number, message: string) {
        let parameters: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ conversation_id, message })
        }
        const res = await fetch(config.API + '/chat/messages/send', parameters)
        const data = await res.json();

        return data.success && data.message as ConversationMessage;
    }

    public static async hasMessages(token: string) {
        let parameters: any = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        }
        const res = await fetch(config.API + '/chat/messages/has', parameters)
        const data = await res.json();

        return data.success && data.count;
    }

    public static async readMessage(token: string, interlocutor_id: number, message_id: number) {
        let parameters: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ profile_id: interlocutor_id, message_id })
        }
        const res = await fetch(config.API + '/chat/messages/read', parameters)
        const data = await res.json();

        return data.success && data.message;
    }
}