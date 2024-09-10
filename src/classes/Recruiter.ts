export default class Recruiter {

    profile_id:number;
    firstname:string;
    lastname:string;
    picture: string;

    constructor(profile:any, picture_url:string){
        this.profile_id = profile.id
        this.firstname = profile.firstname;
        this.lastname = profile.lastname;
        this.lastname = profile.lastname;
        this.picture = picture_url;
    }
}