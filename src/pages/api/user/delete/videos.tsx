import checkerUtils from '@/utils/checker.utils';
import config from "../../../../config.json"
import jwtUtils from '@/utils/jwt.utils';
import { deleteMedia } from '@/handler/media';
import SessionHandler from '@/sides/server/SessionHandler';

const { User } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    try {
        const token = SessionHandler.getAuthorization(req);
        const { id } = req.body;

        if (await checkerUtils.missingParameters(token, id)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
                const profile = await user.getProfile();
                const photo = await profile.getVideoById(id);
                if (photo != null) {
                    if (profile.removeVideo(id)) {
                        deleteMedia(photo.media.id);
                        return res.status(201).json({ message: 'video_deleted' });
                    } else {
                        return res.status(500).json({ message: "video_deteting_failed" })
                    }
                } else {
                    return res.status(400).json({ message: 'video_not_found' });
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
