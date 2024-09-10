export default class Cache {

  datas: any;

  constructor() {
    this.datas = {};
  }

  private static instance: Cache;

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public static setData(key: string, data: any, seconds?: number) {
    let current = null;
    if (seconds != undefined) {
      current = new Date();
      current.setSeconds(current.getSeconds() + seconds);
    }
    Cache.instance.datas[key] = { expireIn: current, ...data };
  }

  public static removeData(key: string) {
    delete Cache.instance.datas[key];
  }

  public static getData(key: string) {
    const data = Cache.instance.datas[key];
    if (data == null) return null;
    if (data.expireIn == null || data.expireIn.getTime() >= new Date().getDate())
      return data;
    Cache.removeData(key)
    return null
  }
}