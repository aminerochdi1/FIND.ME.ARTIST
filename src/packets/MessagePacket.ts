export default class MessagePacket {

    conversation_id: number;
    message: string;

    constructor(conversation_id: number, message: string) {
        this.conversation_id = conversation_id;
        this.message = message;
    }
}