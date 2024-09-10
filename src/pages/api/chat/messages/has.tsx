import Chat from "@/sides/server/Chat";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const errors = await checkerUtils.errors({ token });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors});
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const count = await Chat.hasMessages(user.profile_id);
            return res.status(202).json({success: true, count})
        }
        return res.status(401).json({ message })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
