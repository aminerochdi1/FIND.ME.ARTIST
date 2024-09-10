import Chat from "@/sides/server/Chat";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);
        const { conversation_id } = req.query;

        if (await checkerUtils.missingParameters(token, conversation_id)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const errors = await checkerUtils.errors({ token, conversation_id });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors });
        }

        const { success, message: message_, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile_id = user.profile_id;
            const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
            if (conversation == null)
                return res.status(404).json({ message: "conversation_not_found" })

            const totalMessages = await conversation.countMessages();

            const from = req.query.from;

            const messages = await Chat.listMessagesFromConversation(conversation, from, profile_id);
            const success = messages != undefined;

            return res.status(200).json({ success, total: totalMessages, messages: success ? messages : undefined })
        }
        return res.status(401).json({ message_ })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
