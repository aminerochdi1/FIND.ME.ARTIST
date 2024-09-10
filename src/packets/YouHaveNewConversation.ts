// import DuoConversation from "@/classes/conversations/DuoConversation";
import DuoConversation from "../classes/conversations/DuoConversation";

export default class YouHaveNewConversation {
    
    conversation: DuoConversation;

    constructor(conversation: DuoConversation) {
        this.conversation = conversation;
    }
}