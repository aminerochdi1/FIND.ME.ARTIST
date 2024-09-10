import SessionHandler from '@/sides/server/SessionHandler';
import checkerUtils from '@/utils/checker.utils';
import jwtUtils from '@/utils/jwt.utils';

const { User, Session } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    try {
        if (req.method != "POST") {
            return res.status(400).json({ message: "bad_request" });
        }

        const token = SessionHandler.getAuthorization(req);
        const { languages } = req.body;

        if (await checkerUtils.missingParameters(token, languages)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            try {
                const profile = await user.getProfile();
                await profile.setLanguagesSpeaks(languages)

                return res.status(201).json({ message: "languages_speaks_updated" });
            } catch (error) {
                console.error(error)
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
