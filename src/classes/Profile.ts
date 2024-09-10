import { Job } from "./Job";
import { Media } from "./Media";
import { Body } from "./Body";
import { RoleType } from "./RoleType";
import { Gender } from "./Gender";
import Subscription from "./Subscription";

export class Profile {

    id: number;
    firstname: string;
    lastname: string;
    role: RoleType;
    gender: Gender;
    picture: string | null;
    phone: string | undefined;
    email: string | undefined;
    country: string;
    city: string;
    bornDate: Date;
    isChild: boolean;
    description: string;

    subscription: Subscription|undefined;

    jobs: Job[];
    main_profession: Job | undefined;
    secondary_profession: Job | undefined;

    body: Body | undefined;

    polas: Media[];
    photos: Media[];
    videos: Media[];

    in_agency: boolean;

    agency1: string;
    agency_1_link: string;
    
    agency2: string;
    agency_2_link: string;

    styles_of_photographer: string[];
    styles_of_videomaker: string[];

    travels: string[]
    dont_travels: string[]

    languages_speaks: string[]

    createdAt: Date;
    socialnetworks: any;

    show_phone_number: boolean;
    show_email: boolean;

    constructor(
        subscription: any,
        jobs: any,
        picture_url: string,
        main_profession: any,
        secondary_profession: any,
        polas: any,
        photos: any,
        videos: any,
        body: any,
        styles_of_photographer: any,
        styles_of_videomaker: any,
        travels: any,
        dont_travels: any,
        languages_speaks: any,
        socialnetworks: any,
        profile: any,
        email: string
    ) {
        this.id = profile.id
        this.firstname = profile.firstname;
        this.lastname = profile.lastname;
        this.gender = profile.gender;
        this.role = profile.role;
        this.description = profile.description;
        this.phone = profile.phone;
        this.email = email;

        if(subscription != undefined){
            this.subscription = new Subscription(subscription.price, subscription.expireAt);
        } else {
            this.subscription = undefined;
        }

        var dateNaissance = new Date(profile.born_date).getTime();
        var dateActuelle = new Date().getTime();
        var differenceMilliseconds = dateActuelle - dateNaissance;
        var differenceAnnees = differenceMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        const isChild = differenceAnnees < 18;
        this.isChild = isChild;

        this.country = profile.country; 
        this.city = profile.city;
        this.bornDate = new Date(profile.bornDate);

        this.picture = picture_url;

        this.jobs = jobs.map((job: any) => new Job(job.id, job.name));
        if (main_profession != null)
            this.main_profession = new Job(main_profession.id, main_profession.name);
        if (secondary_profession != null)
            this.secondary_profession = new Job(secondary_profession.id, secondary_profession.name);

        this.styles_of_photographer = styles_of_photographer;
        this.styles_of_videomaker = styles_of_videomaker;

        this.body = body != null ? new Body(body) : undefined;

        this.photos = photos.map((media: any) => new Media(media.media.id, media.media.path, media.media.createdAt, media.id));
        this.polas = polas.map((media: any) => new Media(media.media.id, media.media.path, media.media.createdAt, media.id));
        this.videos = videos.map((media: any) => new Media(media.media.id, media.media.path, media.media.createdAt, media.id));

        this.in_agency = profile.in_agency;

        this.agency1 = profile.agency1;
        this.agency_1_link = profile.agency_1_link;

        this.agency2 = profile.agency2;
        this.agency_2_link = profile.agency_2_link;

        this.travels = travels;
        this.dont_travels = dont_travels;

        this.languages_speaks = languages_speaks;

        this.createdAt = new Date(profile.createdAt);
        this.socialnetworks = socialnetworks;
        this.show_phone_number = profile.show_phone_number;
        this.show_email = profile.show_email;
    }

    public getProfilePath() {
        return this.firstname + "-" + this.lastname + "-" + this.id;
    }
}