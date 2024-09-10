import Chat from "@/sides/server/Chat";
import ProfileHandler from "@/sides/server/ProfileHandler";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);
        const { profile_id } = req.body;

        if (await checkerUtils.missingParameters(token, profile_id)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const errors = await checkerUtils.errors({ token, profile_id });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors});
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfileAttributes(["id"]);
            if (profile.id != profile_id) {
                const conversations = await Chat.getConversationsByProfilesId([profile.id, profile_id]);
                if (conversations.length > 0) {
                    // OPEN DISCUSSION
                    return res.status(202).json({ message: "discussion_open", conversation_id: conversations[0].id })
                } else {
                    const target_profile = await ProfileHandler.getProfileById(profile_id);
                    if(target_profile != null){
                        // CREATE DISCUSSION
                        const { id } = await Chat.createConversation([profile.id, profile_id])
                        return res.status(201).json({ message: "discussion_created", conversation_id: id })
                    } else {
                        // PROFILE NOT FOUND     
                        return res.status(404).json({ message: "target_profile_not_found"})
                    }
                }
            }
            return res.status(406).json({ message: "you_cant_chat_with_you" })
        }
        return res.status(401).json({ message })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
