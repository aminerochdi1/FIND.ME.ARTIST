import { RoleType } from "@/classes/RoleType";
import { Op } from "sequelize";

const EXTERNAL_DATA_URL = 'https://jsonplaceholder.typicode.com/posts';

const { Profile, User, ProfileHasSubscription } = require("../../models")

const WEBSITE = "https://findmeartist.com/";
const PROFILE_PATH = "profile/";
const CURRENT = new Date();

function buildURL(url: string) {
  return '<url><loc>'+url+'</loc><lastmod>'+CURRENT.toISOString().split("T")[0]+'</lastmod></url>';
}

async function generateProfilesSitemap(lang: string) {
  const current = new Date().toISOString();

  const request = {
    where: { role: RoleType.ARTIST },
    include: [
      {
        model: ProfileHasSubscription,
        required: true,
        where: {
          expireAt: {
            [Op.gte]: current
          }
        }
      },
      {
          model: User,
          required: true,
          where: {
              banned: false
          }
      }
    ],
    attibutes: ["id", "firstname", "lastname"]
  }

  const profiles = await Profile.findAll(request);
  return profiles.map((profile:any) => {
    return buildURL(WEBSITE+lang+"/"+PROFILE_PATH+profile.firstname+"-"+profile.lastname+"-"+profile.id)
  })
}

async function generateSiteMap() {
  const languages = ["fr", "en"]
  const pages = ["home", "search", "listings"];


  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${languages.map((language:string) => {
        return pages.map((page:string) => {
          return buildURL(WEBSITE+language+"/"+page)
        })
     })}
     ${await generateProfilesSitemap("fr")}
     ${await generateProfilesSitemap("en")}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }: any) {
  const sitemap = await generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;