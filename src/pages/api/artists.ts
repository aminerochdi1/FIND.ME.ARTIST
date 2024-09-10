// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProfileBuilder } from '@/builders/ProfileBuilder';
import { RoleType } from '@/classes/RoleType';
import SessionHandler from '@/sides/server/SessionHandler';
import checkerUtils from '@/utils/checker.utils';
import { Op } from 'sequelize';
const { Profile, Body, ProfileHasJobs, PhotographerHasStyles, ProfileHasSubscription, User, VideoMakerHasStyles, Job } = require('../../../models');

const LIMIT_PER_PAGE = 12;

export default async function handler(req: any, res: any) {
    try {
        const { filters } = req.body;

        let profileFilter: any = { [Op.and]: [] };
        let bodyFilter: any = { [Op.and]: [] };
        let jobFilter: any = {};
        let photographeStylesFilter: any = {};
        let videomakerStylesFilter: any = {};

        if (filters != undefined) {
            const { name, gender, in_agency, jobs, country, city, photographer_styles, videomaker_styles, age } = filters;

            if (name && name.length > 0) {
                let i: any = { [Op.or]: [] }

                const splited = name.split(" ");
                let names = [name];
                if (splited.length > 1 && splited[0].length > 0) {
                    names = splited;
                }

                names.map((name: string) => {
                    i[Op.or].push({
                        [Op.or]: {
                            firstname: {
                                [Op.like]: `%${name}%`
                            },
                            lastname: {
                                [Op.like]: `%${name}%`
                            }
                        }
                    })
                })

                profileFilter[Op.and].push(i);
            }

            if (age.min != undefined || age.max != undefined) {
                const minDate = new Date();
                const maxDate = new Date();
                const min = age.min ? minDate.setFullYear(minDate.getFullYear() - age.min) : minDate.setFullYear(minDate.getFullYear());
                const max = age.max ? maxDate.setFullYear(maxDate.getFullYear() - age.max) : new Date().setFullYear(maxDate.getFullYear() - 100);

                const n: any = {}
                n["bornDate"] = {
                    [Op.lte]: min,
                    [Op.gte]: max
                };

                profileFilter[Op.and].push(n)
            }

            if (in_agency) {
                profileFilter[Op.and].push({
                    in_agency: true
                })
            }
            /*

            if (!in_agency) {
                profileFilter[Op.and].push(
                    {
                        [Op.and]: {
                            [Op.or]: [
                                { agency1: null },
                                { agency1: '' }
                            ],
                            [Op.or]: [
                                { agency2: null },
                                { agency2: '' }
                            ],
                        },
                    }
                )
            }*/

            if (gender.length > 0) {
                profileFilter[Op.and].push({ [Op.or]: gender.map((g: any) => ({ gender: g })) });
            }

            if (country.length > 0) {
                profileFilter[Op.and].push({ country });
            }

            if (city.length > 0) {
                profileFilter[Op.and].push({ city });
            }

            if (jobs != undefined && jobs.length > 0) {
                let jobs_: any = [];

                for (const job of jobs) {
                    const jobModel = await Job.findOne({
                        where: {
                            name: job
                        },
                        attributes: ["id"]
                    })
                    jobs_.push(jobModel)
                }

                // jobFilter[Op.and].push({ [Op.or]: jobs_.map((jobModel: any) => ({ job_id: jobModel.id })) });
                jobFilter[Op.or] = jobs_.map((jobModel: any) => ({ job_id: jobModel.id }));
            }

            if (photographer_styles.length > 0) {
                photographeStylesFilter[Op.or] = photographer_styles.map((g: any) => ({ style: g }));
            }

            if (videomaker_styles.length > 0) {
                videomakerStylesFilter[Op.or] = videomaker_styles.map((g: any) => ({ style: g }));
            }

            const bodiesParameters = ["ethnic", "hair", "eyes"]
            for (const parameter of bodiesParameters) {
                const target = filters.body[parameter];
                if (target.length > 0) {
                    bodyFilter[Op.and].push(
                        {
                            [Op.or]: target.map((g: any) => {
                                let obj: any = {};
                                obj[parameter] = g;
                                return obj;
                            })
                        }
                    )
                }
            }

            const bodiesMinAndMaxParameters = ["height", "weight", "bust", "hip", "shoe", "waist"]
            const POLICY: any = checkerUtils.POLICY_BODY;
            for (const parameter of bodiesMinAndMaxParameters) {
                const target = filters.body[parameter];
                if (target.min == undefined && target.max == undefined) continue;
                const min = target.min ?? POLICY[parameter].min;
                const max = target.max ?? POLICY[parameter].max;

                const n: any = {}
                n[parameter] = {
                    [Op.between]: [min, max]
                };

                bodyFilter[Op.and].push(n)
            }

            const { tattoo, body_modification } = filters.body;
            if (tattoo != undefined) {
                bodyFilter.tattoo = tattoo
            }
            if (body_modification != undefined) {
                bodyFilter.body_modification = body_modification
            }
        }

        let isAdmin = false;
        const token = SessionHandler.getAuthorization(req);
        if (token != null) {
            const { success, message, user: user_ } = await SessionHandler.checkSession(token);
            if (success) {
                isAdmin = user_.isAdmin;
            }
        }

        const offset = ((req.body.page ?? 1) - 1) * LIMIT_PER_PAGE;
        const current = new Date().toISOString();

        const request = {
            where: { ...profileFilter, role: RoleType.ARTIST },
            include: [
                {
                    model: ProfileHasSubscription,
                    required: !isAdmin,
                    where: {
                        expireAt: {
                            [Op.gte]: current
                        }
                    }
                },
                {
                    model: User,
                    where: {
                        banned: false,
                        isAdmin: false
                    },
                    required: !isAdmin
                },
                {
                    model: Body,
                    where: bodyFilter,
                    required: Object.keys(bodyFilter[Op.and]).length > 0
                },
                {
                    model: ProfileHasJobs,
                    required: Object.keys(jobFilter).length > 0 || Object.getOwnPropertySymbols(jobFilter).includes(Op.or),
                    where: jobFilter
                },
                {
                    model: PhotographerHasStyles,
                    required: Object.keys(photographeStylesFilter).length > 0 || Object.getOwnPropertySymbols(photographeStylesFilter).includes(Op.or),
                    where: photographeStylesFilter
                },
                {
                    model: VideoMakerHasStyles,
                    required: Object.keys(videomakerStylesFilter).length > 0 || Object.getOwnPropertySymbols(videomakerStylesFilter).includes(Op.or),
                    where: videomakerStylesFilter
                }
            ],
            attributes: ["id", "firstname", "lastname", "picture_id", "gender", "main_profession", "country", "city"]
        };

        /**
         * La fonction count comptabilise les includes donc alternative avec ce code ci-dessous
         */
        const total = (await Profile.findAll({
            ...request,
            attributes: ["id"]
        })).length;
        const profiles = await Profile.findAll({
            limit: LIMIT_PER_PAGE,
            offset, ...request
        });

        let profilesData: any = [];
        for (const profile of profiles) {
            const id = profile.id;
            const firstname = profile.firstname;
            const lastname = profile.lastname;
            const picture = await ProfileBuilder.getProfilePictureURL(profile);
            const jobs = await profile.getJobs();
            /*const main_job = await profile.getMainJob();*/
            const country = profile.country;
            const city = profile.city;

            if(jobs.length == 0){
                console.error("ERROR : "+profile.firstname+"-"+profile.lastname+"-"+profile.id+" don't have jobs");
                break;                
            }
            const data = { id, firstname, lastname, main_job: jobs[0].name, picture, country, city };

            profilesData = [...profilesData, data];
        }

        res.status(200).json({ limit: LIMIT_PER_PAGE, pages: Math.ceil(total / LIMIT_PER_PAGE), profiles: profilesData })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
