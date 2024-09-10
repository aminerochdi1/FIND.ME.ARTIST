import checkerUtils from '@/utils/checker.utils';
import jwtUtils from '@/utils/jwt.utils';
import { deleteMedia, uploadMedia } from "../../../../handler/media"
import SessionHandler from '@/sides/server/SessionHandler';

const { User } = require('../../../../../models');

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: any, res: any) {
    try {
        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: "missing_parameters" });
        }


        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();
            try {
                const old_picture_id = profile.picture_id;

                const media = await uploadMedia(profile.id, req, res);
                await profile.update({ picture_id: media.id });

                deleteMedia(old_picture_id);

                return res.status(201).json({ media_id: media.id, message: "media_uploaded" });
            } catch (error) {
                return res.status(400).json(error)
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
