const { Profile } = require('../../../models');

export default class ProfileHandler {

    public static async getProfileById(id: number) {
        const profile = await Profile.findOne({ where: { id }, attributes: ["id"]});
        return profile;
    }
}