export default class SQLUtils {
    public static getDate(date: Date) {
        return date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
    }
}