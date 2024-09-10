import { CountriesHandler } from "@/handler/CountriesHandler";
import { AD, ME_CHAT, PROFILE, buildRoute } from "@/handler/router";
import { buildMediaURL } from "@/utils/client.utils";
import TextUtils from "@/utils/text.utils";
import TimeUtils from "@/utils/time.utils";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import sanitizeHtml from 'sanitize-html';

const AdComponent = (props: { ad: any, lang: string }) => {

    const ad = props.ad;
    const lang = props.lang;

    const translate = useTranslation().t;
    const sanitizeDescription = sanitizeHtml(ad.description, { allowedTags: ['p'] });

    return (
        <div key={ad.id} className="col-12 col-lg-6">
            <div className="border h-100 d-flex flex-column bg-white">
                <article className="h-100 d-flex flex-column">
                        {
                            ad && ad.archived && (
                                <div className="w-100 small px-3 py-1 text-uppercase text-center text-white fw-semibold bg-red">
                                    {translate("ad_archived_message")}
                                </div>
                            )
                        }
                    <header className="p-4 pb-0 h-100 d-flex flex-column">
                        <h2 className="fs-5 text-initial">{ad.title}</h2>
                        <div className="d-flex flex-column pt-4 pb-3">
                            <span><i style={{ width: "15px" }} className="fa-solid fa-location-dot me-2"></i>{ad.city}, {translate(CountriesHandler.getCountryCommon(ad.country))}</span>
                            <span><i style={{ width: "15px" }} className="fa-solid fa-calendar me-2"></i>{translate("start_date_of_the_mission")} <span className="fw-bold">{new Date(ad.begin).toLocaleDateString()}</span></span>
                        </div>
                        <p className="small lh-sm">{TextUtils.truncateString(sanitizeDescription, 600)}{sanitizeDescription.length > 600 && "..."}</p>
                        <div className="mt-auto">
                            <div className="px-3 border-top row align-items-center gy-2 py-3">
                                <div className="col-auto me-auto">
                                    <div className="d-flex gap-2 align-items-center">
                                        <Image width={50} height={50} className="profile-picture small" src={buildMediaURL(ad.recruiter.picture)} alt={ad.recruiter.firstname+" "+ad.recruiter.lastname+" profile picture"} />
                                        <Link className="d-grid text-decoration-none" href={buildRoute(lang, PROFILE + "/" + ad.recruiter.firstname + "-" + ad.recruiter.lastname + "-" + ad.recruiter.profile_id)}>
                                            <span className="small text-dark lh-sm fw-bold">{ad.recruiter.firstname} {ad.recruiter.lastname}</span>
                                            <span className="small text-dark lh-sm">{translate("recruiter")}</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <span className="small ms-auto text-dark">{translate("posted_ago")} {TimeUtils.getPostDuration(translate, new Date(ad.createdAt))}</span>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="d-flex">
                        <Link href={buildRoute(lang, AD + "/" + ad.id)} className="btn fw-semibold btn-white border border-bottom-0 border-start-0 col-6 p-1 d-flex align-items-center justify-content-center">
                            <i className="fa-regular fa-eye me-2"></i>
                            {translate("see_the_advertisement")}
                        </Link>
                        <Link href={buildRoute(lang, ME_CHAT + "?open=" + ad.recruiter.profile_id)} className="btn btn-black border-black col-6 px-0 py-3 d-flex align-items-center justify-content-center">
                            <span>
                                <i className="fa-regular fa-paper-plane me-2"></i>
                                {translate("contact_request")}</span>
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default AdComponent;