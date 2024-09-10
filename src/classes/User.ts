import { Profile } from "./Profile";

export class User {

    id: number;
    email: string;
    isAdmin: boolean;
    profile: Profile;

    constructor(user: any, profile: Profile) {
        this.id = user.id;
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.profile = profile as Profile;
    }
}