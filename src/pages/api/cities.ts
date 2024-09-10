import Chat from "@/sides/server/Chat";
import SessionHandler from "@/sides/server/SessionHandler";
import Cache from "@/utils/cache.utils";
import checkerUtils from "@/utils/checker.utils";
import axios from "axios";

const cache:any = Cache.getInstance();

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") return res.status(400).json({ message: "invalid_request" })

    try {
        const { country } = req.query;

        if (await checkerUtils.missingParameters(country)) {
            return res.status(400).json({ message: "missing_parameters" });
        }

        if(cache[country] != undefined){
            return res.status(200).json(cache[country]);
        }

        try {
            const fetch = await axios.get("http://api.geonames.org/searchJSON?style=SHORT&country=" + country + "&featureClass=P&maxRows=1000&username=doryanbessiere");
            cache[country] = fetch.data;
            return res.status(200).json(fetch.data)
        } catch (error) {
            console.error(error);
        }
        return res.status(401).json({ message: "cant_fetch_cities" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
