import checkerUtils from '@/utils/checker.utils';
import config from "../../../../config.json"
import jwtUtils from '@/utils/jwt.utils';
import SessionHandler from '@/sides/server/SessionHandler';

const { User, Session } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    try {
        if (req.method != "POST") {
            return res.status(400).json({ message: "bad_request" });
        }

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const { ethnic, hair, eyes, height, bust, hip, weight, waist, shoe, tattoo, body_modification } = req.body;

            const profile = await user.getProfile();
            await profile.setBody(ethnic, hair, eyes, height, bust, hip, weight, waist, shoe, tattoo, body_modification);

            return res.status(201).json({ message: "body_updated" });
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
