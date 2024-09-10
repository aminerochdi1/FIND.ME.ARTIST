const EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const FIRSTNAME = /^[\p{L}\-]{2,46}$/u;
const FIRSTNAME_INPUT = /^[\p{L}\-]{0,46}$/u;
const LASTNAME = /^[\p{L}]{2,46}$/u;
const LASTNAME_INPUT = /^[\p{L}]{0,46}$/u;
const USERNAME = /^[\p{L}]{2,92}$/u;
const DESCRIPTION = /^[a-zA-Z0-9\s,;\-'À-ÿ.()]{0,255}$/;
const PHONE = /^(?:\s*\d){10}\s*$/;
const ID = /^[0-9]+$/;
const INSTAGRAM_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_\-\.]+\/?$/;
const FACEBOOK_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9_\-\.]+\/?$/;
const TIKTOK_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?[a-zA-Z0-9_\-\.]+\/?$/;
const YOUTUBE_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:user\/|channel\/)([a-zA-Z0-9_\-]+)$/;
const LINKEDIN_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/)?[a-zA-Z0-9_\-]+\/?$/;
const TWITTER_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_\-]+\/?$/;
const SPOTIFY_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/(?:user\/)?[a-zA-Z0-9_\-]+\/?$/;
const PINTEREST_PROFILE_URL = /^(?:https?:\/\/)?(?:www\.)?pinterest\.com\/[a-zA-Z0-9_\-]+\/?$/;
const YOUTUBE_VIDEO_URL = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const VIMEO_VIDEO_URL = /^https?:\/\/vimeo\.com\/(\d+)/;
const URL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
const POLICY_BODY = {
    height: { min: 110, max: 300 },
    bust: { min: 10, max: 250 },
    hip: { min: 10, max: 300 },
    weight: { min: 10, max: 200 },
    waist: { min: 10, max: 120 },
    shoe: { min: 10, max: 60 }
}

const JOBS_AUTHORIZATIONS:any = {
    actor: ["model"],
    model: ["actor"],
    photographer: ["video_maker"],
    appearing: ["extra_stuntman", "voice_over"],
    extra_stuntman: ["appearing", "voice_over"],
    voice_over: ["extra_stuntman", "appearing"],
    video_maker: ["photographer"],
    hairdresser: ["makeup_artist"],
    makeup_artist: ["hairdresser"],
    influencer: [],
    dancer: [],
    fashion_designer: [],
}

const checker = {
    EMAIL,
    PASSWORD,
    FIRSTNAME,
    FIRSTNAME_INPUT,
    LASTNAME,
    LASTNAME_INPUT,
    USERNAME,
    DESCRIPTION,
    INSTAGRAM_PROFILE_URL,
    FACEBOOK_PROFILE_URL,
    TIKTOK_PROFILE_URL,
    YOUTUBE_PROFILE_URL,
    LINKEDIN_PROFILE_URL,
    TWITTER_PROFILE_URL,
    SPOTIFY_PROFILE_URL,
    PINTEREST_PROFILE_URL,
    YOUTUBE_VIDEO_URL,
    VIMEO_VIDEO_URL,
    URL,
    POLICY_BODY,
    JOBS_AUTHORIZATIONS,
    missingParameters: async (...parameters: any) => {
        for (let i = 0; i < parameters.length; i++)
            if (parameters[i] == null) {
                return true;
            }
        return false;
    },
    errors: (data: any) => {
        var errors: any = [];
        const checker: Record<string, RegExp> = {
            email: EMAIL,
            password: PASSWORD,
            firstname: FIRSTNAME,
            lastname: LASTNAME,
            username: USERNAME,
            phone: PHONE,
            description: DESCRIPTION,
            instagram: INSTAGRAM_PROFILE_URL,
            facebook: FACEBOOK_PROFILE_URL,
            tiktok: TIKTOK_PROFILE_URL,
            youtube: YOUTUBE_PROFILE_URL,
            linkedin: LINKEDIN_PROFILE_URL,
            twitter: TWITTER_PROFILE_URL,
            spotify: SPOTIFY_PROFILE_URL,
            pinterest: PINTEREST_PROFILE_URL
        };

        Object.keys(data).forEach(key => {
            var obj: any = {};
            if (data[key] == undefined) return;
            if (data[key] == "")
                obj[key] = key + "_empty"
            else if (checker[key] != null && !checker[key].test(data[key]))
                obj[key] = key + "_invalid"
            else if (checker[key] == null && key.endsWith("_id") && !ID.test(data[key])) {
                obj[key] = key + "_invalid"
            }

            if (obj[key] != null)
                errors.push(obj)
        });

        if (data.password !== undefined &&
            data.confirmPasword != undefined &&
            data.password !== data.confirmPassword) {
            errors.push({ "password": "password_is_different" });
        }

        return errors;
    }
}

export default checker;