import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import JobsAPI from '@/api/JobsAPI';
import { ClientSide } from '@/sides/client/ClientSide';
import Link from 'next/link';
import { AD, LISTINGS, PROFILE, buildProfileRoute, buildRoute } from '@/handler/router';
import { useRouter } from 'next/router';
import { AdBuilder } from '@/builders/AdBuilder';
import ScreenSizeDetector from '@/components/ScreenSizeDetector';
import { CountriesHandler } from '@/handler/CountriesHandler';
import TimeUtils from '@/utils/time.utils';
import { buildMediaURL } from '@/utils/client.utils';
import { push } from '@/handler/router';
import { ME_CHAT } from '@/handler/router';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function Get(
    props: {
        host: string,
        lang: string,
        jobs: any[],
        title: string,
        user: any,
        ad: any
    }) {

    const ad = props.ad != undefined ? JSON.parse(props.ad) : undefined;
    const user = ClientSide.parseUser(props.user);
    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const deleteAd = () => {

    }

    const router = useRouter();

    /* HEADER BOTTOM NAVBAR */
    const Header = () => {
        return (
            <div className="w-100 d-flex align-items-center">
                <i className="fa-solid fa-chevron-left me-2"></i>
                <Link className="text-black text-clickable" href={buildRoute(lang, LISTINGS)}>{translate("back_to_search_results")}</Link>
                {
                    (ad != null && (user.isAdmin || user.profile.id == ad.recruiter.profile_id)) && (
                        <Link href={(ad && !ad.archived) ? buildRoute(lang, AD + "/" + ad.id + "?archive=true") : "#"} onClick={(e) => deleteAd()} className={"ms-auto bg-transparent border-red text-red p-2 d-flex align-items-center text-uppercase fw-semibold" + (ad && ad.archived ? " opacity-25" : " text-clickable")}>{translate("archive_ad")}</Link>
                    )
                }
            </div>
        )
    }

    const contact = (id: number) => (
        push(router, lang, ME_CHAT + "?open=" + id)
    )

    const [date, setDate] = useState<string>();

    useEffect(() => {
        if (ad)
            setDate(new Date(ad.begin).toLocaleDateString());
    }, [])

    return (
        <>
            <Head>
                <title>{ad ? props.title : "404"}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
                <div className="bg-light py-4">
                    <div className="container">
                        <div className="row m-0">
                            <div className="col">
                                {Header()}
                                
                                <div className="d-block d-md-none py-3">
                                    <button onClick={(e) => contact(ad.recruiter.profile_id)} className="btn btn-black w-100 py-4">{translate("contact_request")}</button>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>

            {
                ad === undefined && (
                    <div className="flex-grow-1 bg-light">
                        <h1 className="text-center pt-5">{translate("ad_not_found")}</h1>
                    </div>
                )
            }
            {
                ad !== undefined && (
                    <div className="flex-grow-1 bg-light">
                        <div className="container mb-5 d-flex justify-content-center">
                            <div className="col-12 border-top row bg-white m-0">
                                {
                                    ad && ad.archived && (
                                        <div className="w-100 fs-5 text-uppercase text-center text-white fw-semibold bg-red">
                                            {translate("ad_archived_message")}
                                        </div>
                                    )
                                }
                                <div className="col-12 col-md-5 col-xxl-4 p-0 d-flex flex-column ">
                                    <div className="d-grid p-3 p-xl-5 gap-1 border-start border-end">
                                        <h1 className="fs-4 mb-4 text-initial">{ad.title}</h1>
                                        <span><i style={{ width: "1.5rem" }} className="fa-solid fa-location-dot fs-3 me-2"></i>{translate(CountriesHandler.getCountryCommon(ad.country))}, {ad.city}</span>
                                        <span><i style={{ width: "1.5rem" }} className="fa-solid fa-calendar fs-3 me-2"></i>{translate("start_date_of_the_mission")} <span className="fw-bold">{date}</span></span>
                                    </div>
                                    <div className="d-block px-3 border-top border-start border-end d-flex flex-column h-100">
                                        <div className="my-auto">
                                            <div className="d-flex  align-items-center py-3">
                                                <Link className="d-flex gap-2 align-items-center text-decoration-none" href={buildProfileRoute(lang, ad.recruiter.firstname, ad.recruiter.lastname, ad.recruiter.profile_id)}>
                                                    <img className="profile-picture small" src={buildMediaURL(ad.recruiter.picture)} alt="" />
                                                    <div className="d-grid">
                                                        <span className="small text-dark lh-sm fw-bold">{ad.recruiter.firstname} {ad.recruiter.lastname}</span>
                                                        <span className="small text-dark lh-sm">{translate("recruiter")}</span>
                                                    </div>
                                                </Link>
                                                <span className="small ms-auto text-dark">{translate("posted_ago")} {TimeUtils.getPostDuration(translate, new Date(ad.createdAt))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={(e) => contact(ad.recruiter.profile_id)} className="d-none d-md-block btn btn-black w-100 py-4">{translate("contact_request")}</button>
                                </div>
                                <div className="col-12 col-md-7 col-xxl-8 lh-sm p-4 pb-2 border-start-0 border-top-0 border">
                                    <div dangerouslySetInnerHTML={{ __html: ad.description }}></div>
                                </div>
                                <button onClick={(e) => contact(ad.recruiter.profile_id)} className="d-block d-md-none btn btn-black w-100 py-4">{translate("contact_request")}</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs());
    const user = await ServerSide.getUser(context);
    const datas = await ServerSide.getServerSideProps(context, undefined, user);
    const { id } = context.query;

    if (datas.user == null)
        return {
            redirect: {
                destination: "/" + datas.lang + "/signin",
                permenant: false
            }
        }

    const { Ads } = require("../../../../../models")

    const adDatas = await Ads.findOne({ where: { id } })
    if (user) {
        const user = JSON.parse(datas.user);

        if (!adDatas || (adDatas.archived && !user?.isAdmin && adDatas.recruiter_id != user.profile_id)) {
            return {
                props: {
                    ...datas,
                    jobs
                }
            };
        }

        const { archive } = context.query;
        if (archive && !adDatas.archived) {
            if (user.isAdmin || adDatas.recruiter_id == user.profile_id) {
                await adDatas.update({
                    archived: true
                });
            }
        }
    }

    const ad = await AdBuilder.build(adDatas);


    return {
        props: {
            ...datas,
            title: "FIND.ME | " + adDatas.title,
            jobs,
            ad: JSON.stringify(ad)
        }
    };
}

