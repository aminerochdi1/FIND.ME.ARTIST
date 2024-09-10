export default class OpenConversationPacket {

    conversation_id: number;

    constructor(conversation_id: number) {
        this.conversation_id = conversation_id;
    }
}