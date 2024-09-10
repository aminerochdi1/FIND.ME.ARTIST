import { Ad } from "@/classes/Ad";
import { Job } from "@/classes/Job";
import Recruiter from "@/classes/Recruiter";
import { ProfileBuilder } from "./ProfileBuilder";

export class AdBuilder {

    public static async build(ad: any) {
        const jobs = (await ad.getJobs()).map((job: any) => new Job(job.id, job.name));
        const recruiter = (await ad.getProfile());

        return new Ad(ad, new Recruiter(recruiter, await ProfileBuilder.getProfilePictureURL(recruiter)), jobs)
    }
}