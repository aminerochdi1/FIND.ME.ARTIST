'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ads extends Model {

    static associate(models) {
      Ads.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profil' });
      Ads.hasMany(models.AdsHasJobs, { foreignKey: 'ad_id' });
    }

    async getProfile() {
      try {
        const profile = await this.getProfil({ attributes: { exclude: ["profile_id"] } });
        return profile;
      } catch (error) {
        console.error(error)
      }
    }

    async getJobs() {
      try {
        const adsHasJobs = await this.getAdsHasJobs({
          include: [
            {
              model: sequelize.models.Job
            }
          ],
          attributes: ["id"],
        });
        const jobs = adsHasJobs.map(phj => ({ ...phj.Job.dataValues }));
        return jobs;
      } catch (error) {
        console.error(error);
      }
    }

    async getJob(name) {
      try {
        const job = await this.getAdsHasJobs({
          include: [
            {
              model: sequelize.models.Job,
              where: {
                name
              }
            }
          ],
          attributes: ["id"],
        });
        if (job.length == 0)
          return null;
        return job[0].Job;
      } catch (error) {
        console.error(error);
      }
    }

    async hasJob(name) {
      return (await this.getJob(name)) != null;
    }

    async addJob(job_id) {
      await this.createAdsHasJob({ job_id });
    }
  }
  Ads.init({
    profile_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    begin: DataTypes.DATE,
    end: DataTypes.DATE,
    description: DataTypes.STRING,
    archived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ads',
  });
  return Ads;
};