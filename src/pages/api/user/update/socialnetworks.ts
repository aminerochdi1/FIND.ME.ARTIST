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

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { instagram, facebook, tiktok, youtube, linkedin, twitter, spotify, pinterest } = req.body;

        const errors = await checkerUtils.errors({ instagram, facebook, tiktok, youtube, linkedin, twitter, spotify, pinterest });
        if (errors.length > 0) {
            return res.status(400).json({ message: "an_error_occurred", errors });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            try {
                const profile = await user.getProfile();
                await profile.setSocialNetworks({ instagram, facebook, tiktok, youtube, linkedin, twitter, spotify, pinterest })

                return res.status(201).json({ message: "socialnetworks_updated" });
            } catch (error) {
                console.error(error)
                return res.status(401).json({ message: "socialnetworks_updated_failed" });
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
