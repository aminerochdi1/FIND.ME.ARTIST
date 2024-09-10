import checkerUtils from "@/utils/checker.utils";

const socialnetworks = {
    instagram: {
        common: "Instagram",
        regex: checkerUtils.INSTAGRAM_PROFILE_URL
    },
    facebook: {
        common: "Facebook",
        regex: checkerUtils.FACEBOOK_PROFILE_URL,
    },
    tiktok: {
        common: "TikTok",
        regex: checkerUtils.TIKTOK_PROFILE_URL
    },
    youtube: {
        common: "YouTube",
        regex: checkerUtils.YOUTUBE_PROFILE_URL
    },
    linkedin: {
        common: "LinkedIn",
        regex: checkerUtils.LINKEDIN_PROFILE_URL
    },
    twitter: {
        common: "Twitter",
        regex: checkerUtils.TWITTER_PROFILE_URL
    },
    spotify: {
        common: "Spotify",
        regex: checkerUtils.SPOTIFY_PROFILE_URL
    },
    pinterest: {
        common: "Pinterest",
        regex: checkerUtils.PINTEREST_PROFILE_URL
    },
}

export default socialnetworks;