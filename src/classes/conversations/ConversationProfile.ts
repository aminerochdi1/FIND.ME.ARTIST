import { ProfileBuilder } from "../../builders/ProfileBuilder";

export default class ConversationProfile {

    id: number;
    firstname: string;
    lastname: string;
    gender: string;
    picture_id: number;
    picture: string|undefined = undefined;
       
    constructor(id: number, picture_id: number, firstname: string, lastname: string, gender: string){
        this.id = id;
        this.picture_id = picture_id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.gender = gender;
    }
       
    public static async fromProfile(profile: {id: number, picture_id: number, firstname: string, lastname: string, gender: string}){
        const id = profile.id;
        const picture_id = profile.picture_id;
        const firstname = profile.firstname;
        const lastname = profile.lastname;
        const gender = profile.gender;

        const conversationProfile  = new ConversationProfile(id, picture_id, firstname, lastname, gender);
        await conversationProfile.fetchProfilePicture();

        return conversationProfile;
    }
    
    public async fetchProfilePicture() {
        this.picture = await ProfileBuilder.getProfilePictureURL(this);
    }
}