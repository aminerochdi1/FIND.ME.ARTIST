import checkerUtils from '@/utils/checker.utils';
import jwtUtils from '@/utils/jwt.utils';
import { uploadMedias } from "../../../../handler/media"
import SessionHandler from '@/sides/server/SessionHandler';

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

            if(profile)

            try {
                const medias = await uploadMedias(profile.id, req, res);

                for (const media of medias) {
                    const id = media.id;
                    profile.addPhotos(id)
                }

                return res.status(201).json({ medias, message: "media_uploaded" });
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
