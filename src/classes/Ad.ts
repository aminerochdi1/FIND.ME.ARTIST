import { Job } from "./Job";
import { Profile } from "./Profile";
import Recruiter from "./Recruiter";

export class Ad {

    id: number;
    recruiter: Recruiter;
    title:string;
    country:string;
    city:string;
    begin:string;
    end:string;
    description:string;
    createdAt: Date;
    archived: boolean;
    jobs:Job[];

    constructor(ad: any, recruiter:Recruiter, jobs: Job[]) {
        this.id = ad.id;
        this.recruiter = recruiter;
        this.title = ad.title;
        this.description = ad.description;
        this.country = ad.country;
        this.city = ad.city;
        this.begin = ad.begin;
        this.end = ad.end;
        this.archived = ad.archived;
        this.createdAt = ad.createdAt;

        this.jobs = jobs;
    }
}