import { UserBuilder } from "@/builders/UserBuilder";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";
import jwtUtils from "@/utils/jwt.utils";
import SQLUtils from "@/utils/sql.utils";
import { Op } from "sequelize";
const { User, Availability } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method != "POST")
        return res.status(400).json({ message: "bad_request" });

    try {
        const token = SessionHandler.getAuthorization(req);

        const { month, day, year } = req.body;

        if (await checkerUtils.missingParameters(token, month, day, year)) {
            return res.status(400).json({ message: 'missing_parameters' });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();
            const targetDate = new Date(year, month - 1, day);
            const sqlDate = SQLUtils.getDate(targetDate);
            const available = await profile.isAvailable(sqlDate);
            if (available) {
                await profile.addUnavailability(sqlDate);
                return res.status(201).json({ message: "unavailability_added" });
            } else {
                await profile.removeUnavailability(sqlDate);
                return res.status(201).json({ message: "unavailability_removed" });
            }
        }
        res.status(400).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
