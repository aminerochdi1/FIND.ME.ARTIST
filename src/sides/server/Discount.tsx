const { DiscountCode } = require('../../../models');

export default class Discount {

    public static async getCode(code: string) {
        try {
            const discountCode = await DiscountCode.findOne({
                where: {
                    code
                }
            })

            if (discountCode != undefined)
                return discountCode;

            return null;
        } catch (error) {
            console.error(error)
        }
        return null;
    }
}