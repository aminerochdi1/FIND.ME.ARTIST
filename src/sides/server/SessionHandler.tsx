// import { UserBuilder } from "@/builders/UserBuilder";
import { UserBuilder } from "../../../src/builders/UserBuilder";
import jwtUtils from "../../utils/jwt.utils";

const { User, Session } = require('../../../models');

export default class SessionHandler {

    public static getAuthorization(req: any) {
        return req.headers.authorization != undefined ? req.headers.authorization.split(" ")[1] : undefined;
    }

    public static async checkSession(token: string) {
        const sessionDecoded = jwtUtils.verifySession(token);
        if (sessionDecoded) {
            const session = await Session.findOne({
                where: { user_id: sessionDecoded.user_id, token }
            })
            if (session != null) {
                let user = await User.findOne({
                    where: { id: sessionDecoded.user_id },
                    attributes: {
                        exclude: ['password']
                    }
                });
                if (user != null) {
                    return { success: true, message: 'session_valid', user, session };
                } else {
                    return { success: false, message: "user_not_found" }
                }
            }
        }
        return { success: false, message: "session_invalid" }
    }
}