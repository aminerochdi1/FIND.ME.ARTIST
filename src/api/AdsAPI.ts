import { Ad } from "@/classes/Ad";
import config from "../config.json"

export class AdsAPI {

    public static async createAds(token: string, profile_id: number, title: string, description: string, country: string, city: string, jobs: string[], begin: string, end: string|undefined) {

        const response = await fetch(config.API + "/announces/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(
                {
                    profile_id,
                    title,
                    description,
                    country,
                    city,
                    jobs,
                    begin,
                    end
                }
            )
        });
        const json = await response.json() ?? undefined;
        return { response, json };
    }

    public static async archiveAd(token: string, ad_id: number) {

        const response = await fetch(config.API + "/ads/archive", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(
                {
                    ad_id
                }
            )
        });
        const json = await response.json() ?? undefined;
        return { response, json };
    }

    public static async getAll(page: number, token: string, filters: any) {
        try {
            let parameters: any = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                }
            };
            if (filters != undefined) {
                let body:any = {
                    page
                };
                if (filters != undefined) {
                    body = {
                        ...body,
                        filters
                    }
                }
                parameters = {
                    ...parameters,
                    body: JSON.stringify(body)
                }
            }
            const res = await fetch(config.API + '/announces/', parameters)
            const data = await res.json();

            return data;
        } catch (error) {
            console.error(error)
        }
    }

    public static getAd(id: number) {
    }
}