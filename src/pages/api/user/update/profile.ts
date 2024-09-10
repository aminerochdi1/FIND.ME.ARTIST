import checkerUtils from '@/utils/checker.utils';
import config from "../../../../config.json"
import jwtUtils from '@/utils/jwt.utils';
import SessionHandler from '@/sides/server/SessionHandler';
import { RoleType } from '@/classes/RoleType';

const { User, Session } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    try {
        if (req.method != "POST") {
            return res.status(400).json({ message: "bad_request" });
        }

        const token = SessionHandler.getAuthorization(req);

        if (await checkerUtils.missingParameters(token)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        const { success, message, user } = await SessionHandler.checkSession(token);
        if (success) {
            const { firstname, lastname, description, phone, gender, in_agency, agency1, agency1Link, agency2, agency2Link, jobs, /*main_profession, secondary_profession */ } = req.body;

            const errors = await checkerUtils.errors({ firstname, lastname, description, phone: phone && phone.length > 0 ? phone : undefined });
            if (errors && errors.length > 0) {
                return res.status(400).json({ errors: errors, message: "an_error_occurred_during_update" });
            }

            const profile = await user.getProfile();
            let updated: any = {
                firstname,
                lastname,
                phone,
                gender,
                in_agency,
                agency1,
                agency2,
                agency_1_link: agency1Link,
                agency_2_link: agency2Link,
                description,
            };

            if (jobs) {
                profile.clearJobs();
                if (profile.role == RoleType.ARTIST) {
                    jobs.map((job: string) => {
                        const job_id = parseInt(job);
                        if (!isNaN(job_id)) {
                            profile.addJob(job_id)
                        }
                    })
                }
            }

            await profile.update(updated);

            return res.status(201).json({ message: "profile_updated" });
        }
        return res.status(401).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
