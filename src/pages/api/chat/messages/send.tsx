import ConversationMessage from "@/classes/conversations/ConversationMessage";
import ConversationProfile from "@/classes/conversations/ConversationProfile";
import Chat from "@/sides/server/Chat";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

export default async function handler(req: any, res: any) { 
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);
        const { conversation_id, message } = req.body;

        if (await checkerUtils.missingParameters(token, conversation_id, message)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const errors = await checkerUtils.errors({ token, conversation_id, message });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors });
        }

        const { success, message: message_, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();
            const profile_id = profile.id;
            const conversation = await Chat.getConversationByProfile(profile_id, conversation_id);
            if (conversation == null)
                return res.status(404).json({ message: "conversation_not_found" })
                
            const conversationMessage = await Chat.storeMessageToConversation(conversation, profile_id, message);
            const success = conversationMessage != undefined;

            const message_id = conversationMessage.id;

            if(success){
                const conversationProfile = new ConversationProfile(profile_id, profile.picture_id, profile.firstname, profile.lastname, profile.gender);
                const conversationMessage = new ConversationMessage(message_id, Number.parseInt(conversation_id), conversationProfile, message, new Date(), false, true)
                return res.status(201).json({ success, message: conversationMessage });
            }

            return res.status(201).json({ success })
        }
        return res.status(401).json({ message_ })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
