import { User } from "@/classes/User";
import { ProfileBuilder } from "./ProfileBuilder";

export class UserBuilder {

    public static async build(user:any) {
        const profileModel = await user.getProfile();
        const profile = await ProfileBuilder.buildPrivate(profileModel, user)

        return new User(user, profile);
    }
}