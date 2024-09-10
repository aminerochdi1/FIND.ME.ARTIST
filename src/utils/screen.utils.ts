export default class ScreenUtils {

    public static XXL = 1400;
    public static XL = 1200;
    public static LG = 992;
    public static MD = 768;
    public static SM = 576;

    public static getSize() {
        if(window == null)return "xxl";

        const innerWidth = ScreenUtils.getInnerWidth();
        const currentScreenSize =
            innerWidth >= 1400 ? 'xxl' :
                innerWidth >= 1200 ? 'xl' :
                    innerWidth >= 992 ? 'lg' :
                        innerWidth >= 768 ? 'md' :
                            innerWidth >= 576 ? 'sm' :
                                'xs';

        return currentScreenSize;
    }

    public static getInnerWidth() {
        if(window == null)return 1400;
        return window.innerWidth;
    }
}