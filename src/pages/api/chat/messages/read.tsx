import Chat from "@/sides/server/Chat";
import ProfileHandler from "@/sides/server/ProfileHandler";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);
        const { profile_id, message_id } = req.body;

        if (await checkerUtils.missingParameters(token, message_id)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const errors = await checkerUtils.errors({ token, message_id });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();

            const hasConversation = (await Chat.getConversationsByProfilesId([profile.id, profile_id])).length > 0;
            if(!hasConversation)  
                return res.status(404).json({ message: "message_not_found" })

            const message = await Chat.getMessage(profile_id, message_id);
            console
            if (message) {
                await message.update({ read: true });

                return res.status(200).json({ message: "message_readed" });
            } else {
                return res.status(404).json({ message: "message_not_found" })
            }
        }
        return res.status(401).json({ message })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
