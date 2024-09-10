import i18n from "@/langs/i18n";

export class ClientSide {

    public static parseUser(user: string) {
        if (user == null) return null;
        return JSON.parse(user);
    }

    public static setLanguage(language: string): void {
        if (i18n.language == language) return;
        i18n.changeLanguage(language);
    }

    public static getDateFormat() {
        if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
            const browserDateFormat:any = Intl.DateTimeFormat().resolvedOptions();
            return browserDateFormat.dateFormat;
        }
        return null;
    }
}