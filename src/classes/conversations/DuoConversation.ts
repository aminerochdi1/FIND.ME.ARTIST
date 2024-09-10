import { Profile } from "../Profile";
import ConversationMessage from "./ConversationMessage";


export default class DuoConversation {

    id: number;
    profile: Profile;
    last_message: ConversationMessage|undefined;
    has_messages: number;

    constructor(id: number, profile: Profile, last_message: ConversationMessage|undefined, has_message: number) {
        this.id = id;
        this.profile = profile;
        this.last_message = last_message;
        this.has_messages = has_message;
    }

}