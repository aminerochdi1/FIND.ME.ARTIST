import { FEMALE_PICTURE, MALE_PICTURE, OTHERS_PICTURE } from "../assets/Assets";
import { Gender } from "../classes/Gender";
import { Profile } from "../classes/Profile";

const { Medias } = require("../../models")

export class ProfileBuilder {

    public static async getProfilePictureURL(profile: any) {
        return profile.picture_id != null ? (await Medias.findOne({ where: { id: profile.picture_id } })).path : (profile.gender == Gender.MALE ? MALE_PICTURE : profile.gender == Gender.FEMELE ? FEMALE_PICTURE : OTHERS_PICTURE);
    }

    public static async getProfilePictureByPictureId(picture_id: number, gender: number) {
        return picture_id != null ? (await Medias.findOne({ where: { id: picture_id } })).path : (gender == Gender.MALE ? MALE_PICTURE : gender == Gender.FEMELE ? FEMALE_PICTURE : OTHERS_PICTURE);
    }

    public static async getProfileDatas(profile: any, user: any) {
        const start = new Date().getTime();
        const jobs = await profile.getJobs();
        const picture_media = await ProfileBuilder.getProfilePictureURL(profile);
        const email = user == undefined ? (await profile.getUser()).email : user.email;
        const main_profession = await profile.getMainJob();
        const secondary_profession = await profile.getSecondaryJob();
        const polas = await profile.listPolas();
        const photos = await profile.listPhotos();
        const videos = await profile.listVideos();
        const body = await profile.getBody();
        const styles_of_photographer = await profile.listStylesOfPhotographer()
        const styles_of_videomaker = await profile.listStylesOfVideoMaker()
        const travels = await profile.listTravel()
        const dont_travels = await profile.listDontTravel()
        const languages_speaks = await profile.listLanguagesSpeaks();
        const subscription = await profile.getSubscription();
        let socialnetworks: any = {};

        (await profile.listSocialNetworks()).map((socialnetwork: any) => {
            socialnetworks[socialnetwork.name] = socialnetwork.link;
        })

        return {
            subscription,
            jobs,
            picture_media,
            email,
            main_profession,
            secondary_profession,
            polas,
            photos,
            videos,
            body,
            styles_of_photographer,
            styles_of_videomaker,
            travels,
            dont_travels,
            languages_speaks, socialnetworks
        }
    }

    public static async build(profile: any, user?: any) {
        const { subscription, jobs, picture_media, email, main_profession, secondary_profession, polas, photos, videos, body, styles_of_photographer, styles_of_videomaker, travels, dont_travels, languages_speaks, socialnetworks } = await this.getProfileDatas(profile, user)
        let profileObj = new Profile(
            subscription, 
            jobs,
            picture_media,
            main_profession,
            secondary_profession,
            polas,
            photos,
            videos,
            body,
            styles_of_photographer,
            styles_of_videomaker,
            travels,
            dont_travels,
            languages_speaks,
            socialnetworks,
            profile,
            email);
            
        if (!profileObj.show_email) profileObj.email = undefined;
        if (!profileObj.show_phone_number) profileObj.phone = undefined;

        return profileObj;
    }

    public static async buildPrivate(profile: any, user?: any) {
        const { subscription, jobs, picture_media, email, main_profession, secondary_profession, polas, photos, videos, body, styles_of_photographer, styles_of_videomaker, travels, dont_travels, languages_speaks, socialnetworks } = await this.getProfileDatas(profile, user)

        return new Profile(
            subscription, 
            jobs,
            picture_media,
            main_profession,
            secondary_profession,
            polas,
            photos,
            videos,
            body,
            styles_of_photographer,
            styles_of_videomaker,
            travels,
            dont_travels,
            languages_speaks,
            socialnetworks,
            profile,
            email);
    }
}