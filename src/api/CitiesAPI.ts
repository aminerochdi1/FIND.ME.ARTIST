import config from "../config.json";

export const fetchCitiesData = async (cca2: string) => {
    const response = await fetch(config.API+"/cities?country=" + cca2);
    const data = await response.json();
    return data.geonames
}