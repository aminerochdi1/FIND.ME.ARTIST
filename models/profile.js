'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'id', targetKey: "profile_id" });
      this.hasOne(models.Body, { foreignKey: 'profile_id' });

      this.hasMany(models.ConversationsHasProfiles, { foreignKey: 'profile_id' });
      this.hasMany(models.ProfileHasSubscription, { foreignKey: 'profile_id' });
      this.hasMany(models.ConversationsMessages, { foreignKey: 'profile_id' });

      this.hasMany(models.Ads, { foreignKey: 'profile_id' });
      this.hasMany(models.ProfileHasJobs, { foreignKey: 'profile_id' });

      this.hasMany(models.Polas, { foreignKey: 'profile_id' });
      this.hasMany(models.Photos, { foreignKey: 'profile_id' });
      this.hasMany(models.Videos, { foreignKey: 'profile_id' });

      this.hasMany(models.PhotographerHasStyles, { foreignKey: 'profile_id' })
      this.hasMany(models.VideoMakerHasStyles, { foreignKey: 'profile_id' })

      this.hasMany(models.ProfileTravel, { foreignKey: 'profile_id' })
      this.hasMany(models.ProfileDontTravel, { foreignKey: 'profile_id' })

      this.hasMany(models.ProfileSpeaks, { foreignKey: 'profile_id' })
      this.hasMany(models.ProfileHasSocialNetworks, { foreignKey: 'profile_id' })

      this.hasMany(models.Availability, { foreignKey: 'profile_id' });
    }

    async setBody(ethnic, hair, eyes, height, bust, hip, weight, waist, shoe, tattoo, body_modification) {
      let body = await this.getBody();
      const updated = { ethnic, hair, eyes, height, bust, hip, weight, waist, shoe, tattoo, body_modification };
      if (body == null) {
        const Body = this.sequelize.model("Body");
        body = await Body.create({ profile_id: this.id, ...updated })
      } else {
        body.update(updated)
      }
    }

    async getSubscription() {
      const current = new Date().toISOString();
      const subscription = await this.getProfileHasSubscriptions({
        where: {
          expireAt: {
            [Op.gte]: current
          }
        }
      })

      if (subscription != undefined && subscription.length > 0)
        return subscription[0];
      return null;
    }

    async freeSubscription() {
      if (await this.getSubscription() != null) return false;

      const date = new Date();
      const expireAt = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

      const subscription = await this.createProfileHasSubscription({
        discount_id: -1 ,
        price: 0,
        expireAt
      });
      return subscription;
    }

    async subscribe(discount_id, price) {
      if (await this.getSubscription() != null) return false;

      const date = new Date();
      const expireAt = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

      const subscription = await this.createProfileHasSubscription({
        discount_id,
        price,
        expireAt
      });
      return subscription;
    }

    async listSocialNetworks() {
      const ProfileHasSocialNetworks = this.sequelize.models.ProfileHasSocialNetworks;
      const ProfileHasSocialNetwork = await ProfileHasSocialNetworks.findAll({ where: { profile_id: this.id } });
      return ProfileHasSocialNetwork.map(socialnetwork => { return { name: socialnetwork.socialnetwork, link: socialnetwork.link } });
    }

    async setSocialNetworks(socialnetworks) {
      await this.deleteAllSocialNetworks();
      Object.keys(socialnetworks).map((key) => {
        if (socialnetworks[key] != undefined) {
          this.addSocialNetwork(key, socialnetworks[key])
        }
      });
    }

    async deleteAllSocialNetworks() {
      const ProfileHasSocialNetworks = this.sequelize.models.ProfileHasSocialNetworks;
      await ProfileHasSocialNetworks.destroy({ where: { profile_id: this.id } });
    }

    async addSocialNetwork(socialnetwork, link) {
      const ProfileHasSocialNetworks = this.sequelize.models.ProfileHasSocialNetworks;
      await ProfileHasSocialNetworks.findOrCreate(
        {
          where: {
            profile_id: this.id, socialnetwork
          },
          defaults: {
            profile_id: this.id, socialnetwork: socialnetwork, link
          }
        });
    }

    async listLanguagesSpeaks() {
      const ProfileSpeaks = this.sequelize.models.ProfileSpeaks;
      const ProfileSpeak = await ProfileSpeaks.findAll({ where: { profile_id: this.id } });
      return ProfileSpeak.map((language) => language.language);
    }

    async setLanguagesSpeaks(languages) {
      await this.deleteAllLanguagesSpeaks();
      languages.map((language) => this.addLanguageSpeak(language));
    }

    async deleteAllLanguagesSpeaks() {
      const ProfileSpeaks = this.sequelize.models.ProfileSpeaks;
      await ProfileSpeaks.destroy({ where: { profile_id: this.id } });
    }

    async addLanguageSpeak(language) {
      const ProfileSpeaks = this.sequelize.models.ProfileSpeaks;
      const obj = { profile_id: this.id, language };
      await ProfileSpeaks.findOrCreate({ where: obj, defaults: obj });
    }

    async listTravel() {
      const ProfileTravel = this.sequelize.models.ProfileTravel;
      const profileTravels = await ProfileTravel.findAll({ where: { profile_id: this.id } });
      return profileTravels.map((travel) => travel.country);
    }

    async setTravels(travels) {
      await this.deleteAllTravels();
      travels.map((travel) => this.addTravel(travel));
    }

    async deleteAllTravels() {
      const ProfileTravel = this.sequelize.models.ProfileTravel;
      await ProfileTravel.destroy({ where: { profile_id: this.id } });
    }

    async addTravel(travel) {
      const ProfileTravel = this.sequelize.models.ProfileTravel;
      const obj = { profile_id: this.id, country: travel };
      await ProfileTravel.findOrCreate({ where: obj, defaults: obj });
    }

    async listDontTravel() {
      const ProfileDontTravel = this.sequelize.models.ProfileDontTravel;
      const ProfileDontTravels = await ProfileDontTravel.findAll({ where: { profile_id: this.id } });
      return ProfileDontTravels.map((travel) => travel.country);
    }

    async setDontTravels(travels) {
      await this.deleteAllDontTravels();
      travels.map((travel) => this.addDontTravel(travel));
    }

    async deleteAllDontTravels() {
      const ProfileDontTravel = this.sequelize.models.ProfileDontTravel;
      await ProfileDontTravel.destroy({ where: { profile_id: this.id } });
    }

    async addDontTravel(travel) {
      const ProfileDontTravel = this.sequelize.models.ProfileDontTravel;
      const obj = { profile_id: this.id, country: travel };
      await ProfileDontTravel.findOrCreate({ where: obj, defaults: obj });
    }

    async listStylesOfPhotographer() {
      return (await this.getPhotographerHasStyles()).map((style) => style.style);
    }

    async setStylesOfPhotographer(styles) {
      await this.deleteAllStyleOfPhotographer();
      styles.map((style) => this.addStyleOfPhotographe(style));
    }

    async deleteAllStyleOfPhotographer() {
      const PhotographerHasStyles = this.sequelize.model("PhotographerHasStyles");
      await PhotographerHasStyles.destroy({ where: { profile_id: this.id } });
    }

    async addStyleOfPhotographe(style) {
      const PhotographerHasStyles = this.sequelize.model("PhotographerHasStyles");
      const obj = { profile_id: this.id, style };
      await PhotographerHasStyles.findOrCreate({ where: obj, defaults: obj });
    }

    async listStylesOfVideoMaker() {
      return (await this.getVideoMakerHasStyles()).map((style) => style.style);
    }

    async setStylesOfVideoMaker(styles) {
      await this.deleteAllStyleOfVideoMaker();
      styles.map((style) => this.addStyleOfVideoMaker(style));
    }

    async deleteAllStyleOfVideoMaker() {
      const VideoMakerHasStyles = this.sequelize.model("VideoMakerHasStyles");
      await VideoMakerHasStyles.destroy({ where: { profile_id: this.id } });
    }

    async addStyleOfVideoMaker(style) {
      const VideoMakerHasStyles = this.sequelize.model("VideoMakerHasStyles");
      const obj = { profile_id: this.id, style };
      await VideoMakerHasStyles.findOrCreate({ where: obj, defaults: obj });
    }

    async listPhotos() {
      return await this.getPhotos({
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
    }

    async getPhotoById(id) {
      const photos = await this.getPhotos({
        where: { id },
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
      if (photos.length == 0)
        return null;
      return photos[0];
    }

    async addPhotos(media_id) {
      try {
        const Photos = this.sequelize.model("Photos");
        const photos = await Photos.create({ profile_id: this.id, media_id });
      } catch (error) {
        console.error(error);
      }
    }

    async removePhotos(id) {
      try {
        const photo = await this.getPhotoById(id);
        await photo.destroy();
        return true;
      } catch (error) {
        console.error(error);
      }
      return false;
    }

    async listVideos() {
      return await this.getVideos({
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
    }

    async getVideoById(id) {
      const videos = await this.getVideos({
        where: { id },
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
      if (videos.length == 0)
        return null;
      return videos[0];
    }

    async addVideo(media_id) {
      try {
        const Videos = this.sequelize.model("Videos");
        const video = await Videos.create({ profile_id: this.id, media_id });
      } catch (error) {
        console.error(error);
      }
    }

    async removeVideo(id) {
      try {
        const video = await this.getVideoById(id);
        await video.destroy();
        return true;
      } catch (error) {
        console.error(error);
      }
      return false;
    }

    async listPolas() {
      return await this.getPolas({
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
    }

    async getPolasById(id) {
      const photos = await this.getPolas({
        where: { id },
        include: [
          {
            model: sequelize.models.Medias,
            as: "media"
          }
        ]
      })
      if (photos.length == 0)
        return null;
      return photos[0];
    }

    async addPolas(media_id) {
      try {
        const Polas = this.sequelize.model("Polas");
        const polas = await Polas.create({ profile_id: this.id, media_id });
      } catch (error) {
        console.error(error);
      }
    }

    async removePolas(id) {
      try {
        const polas = await this.getPolasById(id);
        await polas.destroy();
        return true;
      } catch (error) {
        console.error(error);
      }
      return false;
    }

    async getJobs() {
      try {
        const profileHasJobs = await this.getProfileHasJobs({
          include: [
            {
              model: sequelize.models.Job
            }
          ],
          attributes: ["id"],
        });
        const jobs = profileHasJobs.map(phj => ({ reference_id: phj.id, ...phj.Job.dataValues }));
        return jobs;
      } catch (error) {
        console.error(error);
      }
    }

    async allProfilehasJobs() {
      try {
        const profileHasJobs = await this.getProfileHasJobs({
          include: [
            {
              model: sequelize.models.Job
            }
          ],
          attributes: ["id"],
        });
        return profileHasJobs;
      } catch (error) {
        console.error(error);
      }
    }

    async getMainJob() {
      try {
        const profileHasJobs = await this.getProfileHasJobs({
          where: { id: this.main_profession },
          include: [
            {
              model: sequelize.models.Job
            }
          ]
        });
        if (profileHasJobs.length == 0)
          return null;
        const job = profileHasJobs[0].Job;
        return job;
      } catch (error) {
        console.error(error);
      }
    }

    async getSecondaryJob() {
      try {
        const profileHasJobs = await this.getProfileHasJobs({
          where: { id: this.secondary_profession },
          include: [
            {
              model: sequelize.models.Job
            }
          ]
        });
        if (profileHasJobs.length == 0)
          return null;
        const job = profileHasJobs[0].Job;
        return job;
      } catch (error) {
        console.error(error);
      }
    }

    async getJob(name) {
      try {
        const job = await this.getProfileHasJobs({
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

    async addUnavailability(date) {
      return await this.createAvailability({ date })
    }

    async removeUnavailability(date) {
      const availability = await this.getAvailabilities({ where: { date } });
      if (availability.length > 0) {
        const availabilityId = availability[0].id;
        return await this.sequelize.models.Availability.destroy({ where: { id: availabilityId } });
      }
      return false;
    }


    async isAvailable(date) {
      return ((await this.getAvailabilities({
        where: { date }
      })).length == 0)
    }

    async clearJobs() {
      const jobs = await this.allProfilehasJobs();
      for(const job of jobs){
        job.destroy();
      }
    }

    async addJob(job_id) {
      await this.createProfileHasJob({ job_id });
    }
  }
  Profile.init({
    role: DataTypes.INTEGER,
    picture_id: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    description: DataTypes.STRING,
    bornDate: DataTypes.DATE,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.STRING,
    agency1: DataTypes.STRING,
    agency2: DataTypes.STRING,
    agency_1_link: DataTypes.STRING,
    agency_2_link: DataTypes.STRING,
    main_profession: DataTypes.INTEGER,
    secondary_profession: DataTypes.INTEGER,
    show_phone_number: DataTypes.BOOLEAN,
    show_email: DataTypes.BOOLEAN,
    in_agency: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};