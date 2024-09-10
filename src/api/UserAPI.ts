import config from "../config.json"

export default class UserAPI {

    public static async passwordForget(email: string, language: string){
        const response = await fetch(config.API + "/user/password/forget", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email,
                    language
                }
            )
        });
        const json = await response.json() ?? undefined;
        return json;
    }

    public static async changePassword(datas: {token?: string, password_forget_token?: string, password: string}){
        const response = await fetch(config.API + "/user/password/change", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    ...datas
                }
            )
        });
        const json = await response.json() ?? undefined;
        return json;
    }

    /*
    public static async changePassword(token: string, password: string){
        const response = await fetch(config.API + "/user/password/forget", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email
                }
            )
        });
        const json = await response.json() ?? undefined;
        return json;
    }*/
}