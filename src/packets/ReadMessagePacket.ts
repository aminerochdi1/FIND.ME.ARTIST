export default class ReadMessagePacket {

    conversation_id: number;
    message_id: number;

    constructor(conversation_id: number, message_id: number) {
        this.conversation_id = conversation_id;
        this.message_id = message_id;
    }
}