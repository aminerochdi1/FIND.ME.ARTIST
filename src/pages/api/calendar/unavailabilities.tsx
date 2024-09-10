import { UserBuilder } from "@/builders/UserBuilder";
import checkerUtils from "@/utils/checker.utils";
import jwtUtils from "@/utils/jwt.utils";
import { Op } from "sequelize";
import { Sequelize } from "../../../../models";
const { User, Availability } = require('../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method != "GET")
        return res.status(400).json({ message: "bad_request" });
    try {
        const { profile_id, month, year } = req.query;

        if (await checkerUtils.missingParameters(profile_id, month, year)) {
            return res.status(400).json({ message: 'missing_parameters' });
        }

        const unavailableDates = await Availability.findAll({
            order: [['date', 'ASC']],
            where: {
                profile_id,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month)
                ]
            }
        });

        if (unavailableDates.length > 0) {
            res.status(201).json({ dates: unavailableDates });
        } else {
            res.status(201).json({ dates: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
