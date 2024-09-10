// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AdBuilder } from "@/builders/AdBuilder";
import { Ad } from "@/classes/Ad";
import { ServerSide } from "@/sides/server/ServerSide";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";
import { Op } from "sequelize";

const { Ads, AdsHasJobs, Job } = require('../../../../models');

const LIMIT_PER_PAGE = 12;

export default async function handler(req: any, res: any) {

    try {
        if (req.body.filters == undefined) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { job, begin, country, city } = req.body.filters;

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token, job, country, city)) {
            return res.status(400).json({ message: "missing_parameters" });
        }


        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const currentTime = new Date().getTime();
            const beginDate = begin != undefined ? new Date(begin) : new Date();

            if (beginDate.getTime() < currentTime) {
                return res.status(400).json({ message: 'the_date_cannot_be_less_than_today' });
            }

            if (country.length > 0 && !ServerSide.countryExist(country)) {
                return res.status(400).json({ message: 'country_not_found' });
            }

            if (country.length > 0 && !ServerSide.citiesExist(city)) {
                return res.status(400).json({ message: 'city_not_found' });
            }

            let where: any = {
                begin: { [Op.gte]: beginDate.toISOString().split("T")[0] }
            };

            if (country.length > 0) {
                where = { ...where, country }
            }

            if (city.length > 0) {
                where = { ...where, city }
            }

            if (!user.isAdmin) {
                where = { ...where, archived: false }
            }

            let whereJob = {}

            if (job.length > 0) {
                whereJob = {
                    name: job
                }
            }

            /**
             * Attention, il peut sûrement arriver que le nombre d'annonces ne soit pas correctement compter.
             * Cela sera soit à cause du where qu'il ne filtre pas correctement ou parce que le include comptabilise
             * les résultats.
             */
            const offset = ((req.body.page ?? 1) - 1) * LIMIT_PER_PAGE;
            const total = await Ads.count({ where })

            /**
             * Attention j'ai retirer l'attribut required qui fessait buger la recherche
             */
            const adsFetched = await Ads.findAll({
                limit: LIMIT_PER_PAGE,
                offset,
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        model: AdsHasJobs,
                        attributes: ["id"],
                        include: [
                            {
                                model: Job,
                                where: whereJob,
                            }
                        ]
                    }
                ],
            })

            if (adsFetched.length > 0) {
                const ads: Ad[] = [];
                for (const ad of adsFetched) {
                    ads.push(await AdBuilder.build(ad))
                }

                return res.status(201).json({ limit: LIMIT_PER_PAGE, pages: Math.ceil(total / LIMIT_PER_PAGE), ads });
            } else {
                return res.status(201).json({ limit: LIMIT_PER_PAGE, pages: Math.ceil(total / LIMIT_PER_PAGE), ads: [] });
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
