import { UserBuilder } from "@/builders/UserBuilder";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) {
    try {
        const { token } = req.body;

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: 'missing_parameters' });
        }

        const { success, message, user, session } = await SessionHandler.checkSession(token);
        
        if(success)
            return res.status(200).json({ message, user: await UserBuilder.build(user), session });
        return res.status(401).json({ message: 'session_invalid' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
