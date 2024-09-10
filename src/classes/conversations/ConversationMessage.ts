import { Profile } from "../Profile";
import ConversationProfile from "./ConversationProfile";

export default class ConversationMessage {
    
    id: number;
    conversation_id: number;
    profile: ConversationProfile;
    message: string;
    createdAt: Date;
    read:boolean;
    isLast:boolean;

    constructor(id: number, conversation_id: number, profile: ConversationProfile, message: string, createdAt: Date, read: boolean, isLast: boolean){
        this.id = id;
        this.conversation_id = conversation_id;
        this.profile = profile;
        this.message = message;
        this.createdAt = createdAt;
        this.read = read;
        this.isLast = isLast;
    }
}