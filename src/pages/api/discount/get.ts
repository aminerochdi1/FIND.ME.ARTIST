import { UserBuilder } from "@/builders/UserBuilder";
import Discount from "@/sides/server/Discount";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";
const { DiscountCode } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") return res.status(400).json({ message: "invalid_request" })

    try {
        const { code } = req.query;

        if (await checkerUtils.missingParameters(code)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const discountcode:any = await Discount.getCode(code);

        if (discountcode != undefined && !discountcode.disabled)
            return res.status(201).json({ found: true, reduction: discountcode.reduction });

        return res.status(401).json({ found: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
