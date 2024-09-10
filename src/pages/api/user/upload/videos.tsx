import checkerUtils from '@/utils/checker.utils';
import SessionHandler from '@/sides/server/SessionHandler';

const { Medias } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const token = SessionHandler.getAuthorization(req);

        const { link } = req.body;

        if (await checkerUtils.missingParameters(token, link)) {
            return res.status(400).json({ message: "missing_parameters" });
        }
        
        if(!checkerUtils.YOUTUBE_VIDEO_URL.test(link) && !checkerUtils.VIMEO_VIDEO_URL.test(link)){
            return res.status(400).json({ message: "invalid_link" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();
            
            try {
                const media = await Medias.create({
                    profile_id: profile.id,
                    path: link
                });
                profile.addVideo(media.id);    

                return res.status(201).json({ media, message: "media_uploaded" });
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
