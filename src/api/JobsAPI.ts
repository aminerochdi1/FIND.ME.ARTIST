import config from "../config.json";

export default class JobsAPI {
  public static async getJobs() {
    const res = await fetch(config.API + '/jobs/all');
    const data = await res.json();
    var jobs: string[] = [];

    return data.jobs;
  };
}