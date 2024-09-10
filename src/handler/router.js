import { fetchLang } from "../utils/client.utils";

export const ACCOUNT_SETTINGS = "/account/settings";
export const PROFILE = "/profile"
export const SIGNIN = "/signin"
export const SIGNUP = "/signup"
export const PROFILES_SEARCH = "/profiles/search";
export const LISTINGS = "/listings";
export const ME_CHAT = "/me/chat"
export const ME_CALENDAR = "/me/calendar"
export const ME_ADS = "/me/ads";
export const AD = "/listings/ad";
export const ADMINISTRATION = "/admin/";
export const SEARCH = "/seach";
export const CREATE_ADVERTISEMENT = LISTINGS + "/create";
export const LOGOUT = "/logout";
export const CGV = "/terms-and-conditions-of-sale";
export const CGU = "/terms-and-conditions";
export const LEGAL_NOTICE = "/legal-notice";

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buildRoute(lang, route) {
    return removeAccents("/" + lang + route);
}

function buildProfileRoute(lang, firstname, lastname, id) {
    return buildRoute(lang, PROFILE + "/" + firstname + "-" + lastname + "-" + id);
}

function push(router, lang, route) {
    router.push(buildRoute(lang, route));
}

export { push, buildRoute, buildProfileRoute }
