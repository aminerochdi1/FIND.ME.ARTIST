import config from "../config.json";

export const getArtists = async (page: number, filters?: any, token?: string) => {

  let parameters: any = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  if (filters != undefined) {
    let body:any= {
      page
    };
    if (filters != undefined) {
      body = {
        ...body,
        filters
      }
    }
    parameters = {
      ...parameters,
      body: JSON.stringify(body)
    }
  }

  if(token != undefined){
    parameters.headers["Authorization"] = "Bearer "+token;
  }

  const res = await fetch(config.API + '/artists', parameters)
  const data = await res.json();
  return data;
};
