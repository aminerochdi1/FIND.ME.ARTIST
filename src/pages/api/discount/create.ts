import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

const { User, DiscountCode } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const { code, reduction, expireAt } = req.body;

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token, code, expireAt)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success && user.isAdmin) {
            const request = {
                code,
                reduction: reduction / 100,
                expireAt,
                disabled: false
            };
            DiscountCode.create(request)
            return res.status(201).json({ message: "code_created" });
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
