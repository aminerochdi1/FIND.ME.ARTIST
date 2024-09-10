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
        const { profile_id, title, description, country, city, jobs, begin, end } = req.body;

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token, profile_id, title, description, country, city, jobs, begin)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const profile = await user.getProfile();

            if (profile.role == RoleType.RECRUITER) {
                const beginDate = new Date(begin);
                const endDate = new Date(end);
                const currentTime = new Date().getTime();

                /*
                 * On vérifie que les dates de l'annonce soit cohérentes entre celle d'aujourd'hui et les deux 
                */
                if (beginDate.getTime() < currentTime || endDate.getTime() < currentTime) {
                    return res.status(400).json({ message: 'the_date_cannot_be_less_than_today' });
                }

                if (beginDate.getTime() > endDate.getTime()) {
                    return res.status(400).json({ message: 'the_end_cant_be_before_the_beginning' });
                }

                /*
                 * On vérifie si ce pays exist pour éviter l'entrer de faux pays 
                */
                if (!ServerSide.countryExist(country)) {
                    return res.status(404).json({ message: 'country_not_found' });
                }

                /*
                 * On vérifie si cette ville exist pour éviter l'entrer de fausse ville 
                */
                if (!ServerSide.citiesExist(city)) {
                    return res.status(404).json({ message: 'city_not_found' });
                }

                /**
                 * Protection d'un contenu html pour éviter de l'injection
                 */
                const sanitizedDescription = sanitizeHtml(description, {
                    allowedTags: ['strong', 'i', 'i', 'ol', 'ul', 'li'],
                });

                return await Ads.create({ profile_id, title, description: sanitizedDescription, country, city, begin, end })
                    .then((instance: any) => {
                        const ad_id = instance.id;
                        try {
                            jobs.map((job: string) => {
                                const job_id = parseInt(job);
                                if (!isNaN(job_id)) {
                                    instance.addJob(job_id)
                                }
                            })

                            return res.status(201).json({ ad_id: ad_id })
                        } catch (error) {
                            console.error(error);
                            Ads.destroy({ where: { id: ad_id } });
                        }
                    }).catch((err: any) => {
                        console.error(err);
                        res.status(500).json({ message: 'internal_server_error' });
                    })
            } else {
                return res.status(401).json({ message: 'you_are_not_recruiter' });
            }
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
