// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { RoleType } from "@/classes/RoleType";
import { ServerSide } from "@/sides/server/ServerSide";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";
import sanitizeHtml from 'sanitize-html';

const { User, Ads } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const { ad_id } = req.body;

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token, ad_id)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const ad = await Ads.findOne({ where: { id: ad_id } })

            if (!ad) {
                return res.status(401).json({ message: "ad_not_found" });
            }

            if (user.isAdmin || ad.profile_id == user.profile_id) {
                await ad.update({
                    archived: true
                });
                return res.status(201).json({ message: 'ad_archived' });
            } else {
                return res.status(401).json({ message: 'you_dont_have_permission' });
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
