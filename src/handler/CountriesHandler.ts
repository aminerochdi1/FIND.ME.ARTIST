import getCountries from "@/assets/countries.json"

export class CountriesHandler {

    public static getCountryCommon(cca2:string): string {
        const countriesFound = getCountries.filter((country) => country.cca2 == cca2);
        if(countriesFound.length > 0){
            return countriesFound[0].common;
        }
        return "common_not_found["+cca2+"]";
    }
}