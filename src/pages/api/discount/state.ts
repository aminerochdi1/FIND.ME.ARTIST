import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";

const { User, DiscountCode } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    try {
        const { id, disabled } = req.body;

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token, id, disabled)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success && user.isAdmin) {
            const discountCode = await DiscountCode.findOne({
                where: {
                    id
                }
            })
            if (discountCode != undefined) {
                discountCode.update({ disabled })
                return res.status(202).json({ message: "code_updated" });
            } else {
                res.status(404).json({ message: "code_not_found" })
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
