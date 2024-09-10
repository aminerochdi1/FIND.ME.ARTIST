import config from "../config.json"

export default class CalendarAPI {

    public static async handleDate(token: string, year: number, month: number, day: number) {

        const response = await fetch(config.API + "/calendar/handle", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(
                {
                    year, month, day
                }
            )
        });
        const json = await response.json() ?? undefined;
        return { response, json };
    }

    public static async getUnvailabilities(profile_id: number, month: number, year: number) {
        const params: any = { profile_id, month, year }

        const url = new URL(config.API + '/calendar/unavailabilities')
        url.search = new URLSearchParams(params).toString();
        const res = await fetch(url)
        const data = await res.json();

        return data.dates;
    }
}