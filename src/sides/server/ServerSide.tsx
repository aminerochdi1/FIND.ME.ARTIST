import getCountries from "../../assets/countries.json"
import { User } from "@/classes/User";
import { getSessionWithCookies } from "../../handler/session";
import resources from "@/langs/resources"
import SessionHandler from "./SessionHandler";
import { UserBuilder } from "@/builders/UserBuilder";

export class ServerSide {

    public static stringifyUser(user: User) {
        return JSON.stringify(user);
    }

    public static async getUser(context: any) {
        const token = await getSessionWithCookies(context.req.cookies);
        if (token === undefined) return null;

        const { success, user } = await SessionHandler.checkSession(token);
        if (success && user != null) {
            const { lang } = context.query;
            if (user.language != lang) {
                await user.update({ language: lang })
            }
            
            return (await UserBuilder.build(user)) as User;
        }
        return null;
    }

    public static countryExist(cca2: string) {
        return getCountries.filter((country) => cca2 == country.cca2).length > 0;
    }

    /**
     * TODO: Réaliser cette fonction afin de vérifier si une ville est existante ou pas
     * 
     * @param cca2 
     * @returns 
     */
    public static citiesExist(cca2: string) {
        return true;
    }

    public static translate(lang: string, path: string) {
        const resources_: any = resources;
        const lang_ = resources_[lang];
        if (lang_ == undefined)
            return "translation_not_found"
        return lang_.translation[path];
    }

    public static async getServerSideProps(context: any, title?: string, user?: User | undefined | null,) {
        const user_ = user == undefined ? await ServerSide.getUser(context) : user;
        const host = context.req.headers.host;
        const { lang } = context.query;

        const user_json = user_ != null ? this.stringifyUser(user_) : null;
        const title_ = (title != undefined ? "FIND.ME | " + ServerSide.translate(lang, title) : "Find.me");

        return { user: user_json, host, lang, title: title_ };
    }

    public static async getRedirectionWithoutLanguage(context: any) {
        const language = context.req.headers["accept-language"] ?? "en";
        return {
            redirect: {
                destination: "/" + language.split(",")[0].split("-")[0].toLowerCase(),
                permenant: false
            }
        }
    }
}