import config from "../config.json"

export class DiscountAPI {

    public static async getReduction(code: string) {
        try {
            const res = await fetch(config.API + '/discount/get?code=' + code)
            const data = await res.json();

            if (data.found != undefined && data.found)
                return data.reduction;

            return null;
        } catch (error) {
            console.error(error)
        }
        return null;
    }

    public static async createDiscountCode(token: string, code: string, reduction: number, expireAt: string) {

        const response = await fetch(config.API + "/discount/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(
                {
                    code,
                    reduction,
                    expireAt
                }
            )
        });
        const json = await response.json() ?? undefined;
        return { response, json };
    }

    public static async changeStateDiscountCode(token: string, id: number, disabled: boolean) {

        const response = await fetch(config.API + "/discount/state", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(
                {
                    id,
                    disabled
                }
            )
        });
        const json = await response.json() ?? undefined;
        return { response, json };
    }
}