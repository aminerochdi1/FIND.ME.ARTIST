import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import config from "../../../config.json"
import { ProfileBuilder } from '@/builders/ProfileBuilder';
import { Op } from 'sequelize';
import { ServerSide } from '@/sides/server/ServerSide';
import { buildMediaThumbnailURL, buildMediaURL } from '@/utils/client.utils';
import eyes from "@/assets/eyes.json"
import ethnics from "@/assets/ethnics.json"
import hairs from "@/assets/hairs.json"
import getCountries from '@/assets/countries.json';
import Link from 'next/link';
import { AD, CREATE_ADVERTISEMENT, LISTINGS, ME_CHAT, PROFILES_SEARCH, buildRoute } from '@/handler/router';
import { ClientSide } from '@/sides/client/ClientSide';
import { CountriesHandler } from '@/handler/CountriesHandler';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';
import checkerUtils from '@/utils/checker.utils';
import Footer from '@/components/Footer';
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { RoleType } from '@/classes/RoleType';
import Image from 'next/image';

export default function Profile(props: { lang: string, host: string, user?: any, profile: any, travels: string[], dont_travels: string[], title: string, openCalendar: boolean }) {

    const socialNetworks: any = require('@/assets/socialnetworks').default;
    const flags: any = require("@/assets/flags.json");

    const scrollToCarousel = () => {
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 100);

    }

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const router = useRouter();
    const [showImage, setShowImage] = useState<string | undefined>(undefined);

    const user: any = ClientSide.parseUser(props.user);
    const lang = props.lang;
    const travels = props.travels;
    const dont_travels = props.dont_travels;

    const profile = JSON.parse(props.profile);
    const host = props.host;

    const NotFound = () => {
        return (
            <div>
                <h1 className="text-center pt-5">{translate("profile_not_found")}</h1>
            </div>
        )
    }

    const genders: string[] = config.genders.map((gender) => translate(gender));
    const gendersIcons = [
        <i className="fa-solid fa-venus me-2" key={1}></i>,
        <i className="fa-solid fa-mars me-2" key={2}></i>
    ]

    const Videos = () => {
        return (
            <div className="px-lg-4">
                <div className="d-flex px-3">
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                    <h3 className="fs-1 bg-white px-3">{translate("videos")}</h3>
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                </div>
                <div className="row m-0 g-0">
                    {
                        profile.videos.map((media: any, index: number) => {
                            const isYoutubeLink = checkerUtils.YOUTUBE_VIDEO_URL.test(media.path);
                            const match = isYoutubeLink ? media.path.match(checkerUtils.YOUTUBE_VIDEO_URL) : media.path.match(checkerUtils.VIMEO_VIDEO_URL);
                            return (
                                <div key={index} className="col-12 col-xl-6">
                                    <div className="video-container bg-light" key={index}>
                                        <div className="position-absolute top-0 start-0 end-0 bottom-0 justify-content-center align-items-center d-flex flex-column gap-2 ">
                                            <i className="fa-brands fa-youtube fs-1" style={{ color: "#FF0000" }}>

                                            </i>
                                            <div className="spinner-border" style={{ color: "#FF0000" }} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                        <div className="position-absolute top-0 start-0 end-0 bottom-0">
                                            {
                                                isYoutubeLink ? (
                                                    <iframe className="w-100 h-100" src={"https://www.youtube.com/embed/" + match[1]} frameBorder={0} allowFullScreen={true}></iframe>
                                                ) : (
                                                    <iframe className="w-100 h-100" src={"https://player.vimeo.com/video/" + match[1]} frameBorder={0} allowFullScreen={true}></iframe>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const Polas = () => {
        return (
            <div className="px-lg-4">
                <div className="d-flex px-3">
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                    <h3 className="fs-1 bg-white px-3">{translate("polas")}</h3>
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                </div>
                <div className="row m-0 g-0">
                    {
                        profile.polas.map((media: any, index: number) => {
                            return (
                                <a className="col-4" href="#carousel" onClick={(e) => { setShowContent(Carousels(profile.polas, index)); scrollToCarousel() }} key={index}>
                                    <div className="text-white position-relative">
                                        <Image width={500} height={500} className="object-fit-cover object-fit-center h-100 w-100" src={buildMediaThumbnailURL(media.path, 500, 500)} alt={profile.firstname+" "+profile.lastname+" digital"} />
                                    </div>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const Photos = () => {
        return (
            <div className="px-lg-4 mt-4 clickable">
                <div className="d-flex px-3">
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                    <h3 className="fs-1 bg-white px-3">{translate("photos")}</h3>
                    <div className="w-100 my-auto">
                        <div className="border-top border-black w-100"></div>
                    </div>
                </div>
                <div className="row m-0 g-0">
                    {
                        profile.photos.map((media: any, index: number) => {
                            return (
                                <a className="col-4" href="#carousel" onClick={(e) => { setShowContent(Carousels(profile.photos, index)); scrollToCarousel() }} key={index}>
                                    <div className="text-white position-relative">
                                        <Image width={500} height={500} className="object-fit-cover object-fit-center h-100 w-100" src={buildMediaThumbnailURL(media.path, 500, 500)} alt={profile.firstname+" "+profile.lastname+" photo"} />
                                    </div>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const Carousels = (medias: any[], target: number) => {
        return (
            <>
                <div id="#carousel" >
                    <Swiper navigation={true} className=""
                        initialSlide={target}>
                        {
                            medias.map((media, index) => {

                                const imageUrl: any = buildMediaURL(media.path);

                                return (
                                    <SwiperSlide key={index}>
                                        <div className="image-container">
                                            <img src={imageUrl} className={"clickable"} alt="..." onClick={(e) => setShowImage(imageUrl)} />
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>
                </div>
            </>
        )
    }

    const hasProfileInformations = () => {
        return (
            (profile.description != undefined && profile.description.length > 0) ||
            profile.agency1 != undefined && profile.agency1.length > 0 ||
            profile.agency2 != undefined && profile.agency2.length > 0 ||
            profile.body != undefined ||
            (profile.dont_travels.length > 0) ||
            (profile.languages_speaks.length > 0) ||
            Object.keys(profile.socialnetworks).length > 0
        )
    }

    const ProfileDetails = () => {
        return (
            <>
                {
                    profile != undefined && profile.role == RoleType.ARTIST ? (
                        <>
                            {profile.jobs.map((job: any, index: number) => {
                                return (
                                    <div key={index} className={(index == profile.jobs.length - 1 && "border-bottom") + " border-top p-2 d-flex"}>
                                        <span className="fw-semibold text-uppercase text-center w-100 lh-1">
                                            {
                                                translate(job.name)
                                            }
                                        </span>
                                    </div>
                                )
                            })
                            }
                        </>
                    ) : (
                        <>
                            <div className="border-bottom border-top p-2 d-flex">
                                <span className="fw-semibold text-uppercase text-center w-100 lh-1">
                                    {
                                        translate("recruiter")
                                    }
                                </span>
                            </div>
                        </>
                    )
                }
                {
                    profile.body != null && (
                        <div className="border-bottom px-5 py-4">
                            <h2 className="fs-4 pt-1 pb-2">{translate("body_physics")}</h2>
                            <div className="row g-0 small">
                                <div className="col-6">
                                    <ul className="list-unstyled mb-1 me-3">
                                        <li>{translate("hair")}: <span className="fw-bold">{translate(hairs[profile.body.hair])}</span></li>
                                        <li>{translate("height")}: <span className="fw-bold">{profile.body.height} cm</span></li>
                                        <li>{translate("hip")}: <span className="fw-bold">{profile.body.hip} cm</span></li>
                                        <li>{translate("shoe")}: <span className="fw-bold">{profile.body.shoe}</span></li>
                                        <li>{translate("body_modification")}: <span className="fw-bold">{[translate("no"), translate("yes")][profile.body.body_modification ? 1 : 0]}</span></li>
                                    </ul>
                                </div>
                                <div className="col-6 d-flex col-xxl">
                                    <ul className="ms-auto list-unstyled mb-0">
                                        <li>{translate("eyes")}: <span className="fw-bold">{translate(eyes[profile.body.eyes])}</span></li>
                                        <li>{translate("bust")}: <span className="fw-bold">{profile.body.bust}</span></li>
                                        <li>{translate("waist")}: <span className="fw-bold">{profile.body.waist} cm</span></li>
                                        <li>{translate("weight")}: <span className="fw-bold">{profile.body.weight} kg</span></li>
                                        <li>{translate("tattoo")}: <span className="fw-bold">{[translate("no"), translate("yes")][profile.body.tattoo ? 1 : 0]}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    profile.description.length > 0 && (
                        <div className="border-bottom px-5 py-3">
                            <h2 className="fs-4 pt-1 pb-2">{translate("description")}</h2>
                            <p className="lh-sm small">{profile.description}</p>
                        </div>
                    )
                }
            </>
        )
    }

    const ProfileInformations = () => {

        return (
            <>
                {
                    ((profile.in_agency && profile.agency2 != undefined && profile.agency2.length > 0) || (profile.in_agency && profile.agency1 != undefined && profile.agency1.length > 0)) && (
                        <>
                            <div className="border-bottom px-5 py-3 d-flex flex-column gap-2    ">
                                <h2 className="fs-4 pt-1">{translate(profile.role == RoleType.ARTIST ? "agencies" : "companies")}</h2>
                                {
                                    profile.in_agency && profile.agency1 != undefined && profile.agency1.length > 0 && (
                                        <div>
                                            <h3 className="fs-5 text-primary lh-1 mb-0 pt-1">{profile.agency1}</h3>
                                            <a href={profile.agency_1_link} className="lh-sm text-black">{profile.agency_1_link}</a>
                                        </div>
                                    )
                                }
                                {
                                    profile.in_agency && profile.agency2 != undefined && profile.agency2.length > 0 && (
                                        <div>
                                            <h3 className="fs-5 text-primary lh-1 mb-0 pt-1">{profile.agency2}</h3>
                                            <a href={profile.agency_2_link} className="lh-sm text-black">{profile.agency_2_link}</a>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )
                }
                {
                    (profile.dont_travels.length > 0) && (
                        <div className="border-bottom px-5 py-4">
                            <div className="d-flex align-items-center">
                                <div className="rounds bg-danger border-0"></div>
                                <div className="ms-3 d-flex flex-column ">
                                    <h2 className="mb-0 lh-1 fs-6 w-100 ">{translate("dont_travel")}</h2>
                                    {
                                        (dont_travels != undefined && dont_travels.length > 0) ? (
                                            dont_travels.map((country: string, index: number) => {
                                                return (index == 0 ? "" : ", ") + translate(country)
                                            })
                                        ) : (
                                            <span className="text-dark">{translate("any_country")}</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    (profile.languages_speaks.length > 0) && (
                        <div className="border-bottom px-5 py-3">
                            <h2 className="fs-4 pt-1 pb-2">{translate("languages_speak")}</h2>
                            <ul className="list-unstyled">
                                {profile.languages_speaks.map((language: string, index: number) => {
                                    return <li key={index} className="fw-semibold"><span className="me-2">{flags[language]}</span>{translate(language)}</li>
                                })}
                            </ul>
                        </div>
                    )
                }
                {
                    Object.keys(profile.socialnetworks).length > 0 && (
                        <div className="px-5 py-3">
                            <h2 className="fs-4 pt-1 pb-2">{translate("social_networks")}</h2>
                            <div className="row">
                                {Object.keys(socialNetworks).map((key: any, index: number) => {
                                    if (profile.socialnetworks[key] == null) return;
                                    return (
                                        <div key={index} className="col-auto">
                                            <Link target="_blank" rel="noopener noreferrer" className="text-black fs-2" href={profile.socialnetworks[key]}><i className={"fa-brands fa-" + key}></i></Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
            </>
        )
    }

    //const [showAvailabilities, setShowAvailabilities] = useState<boolean>(false);

    const Availabilities = () => {

        const [copied, setCopied] = useState(false);

        useEffect(() => {
            const timeout = setTimeout(() => {
                if (copied) setCopied(false);
            }, 1600);

            return () => clearTimeout(timeout);
        }, [copied]);

        const copyCalendarLink = () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url)
        }

        return (
            <div id="calendar" className="d-flex flex-column p-3 py-lg-4 px-lg-5">
                <button style={{ width: "50px" }} type="button" onClick={(e) => { setCopied(true); copyCalendarLink() }} className={"ms-auto position-relative button-copy-link " + (copied ? "clicked" : "") + " ms-auto bg-transparent border-0 p-3 fs-3"}>
                    {
                        copied ? (
                            <>
                                <i style={{ color: "var(--bs-green" }} className="fa-solid fa-check "></i>
                                <p className="fs-6 position-absolute fw-semibold text-black" style={{ bottom: "50%", left: "50%", transform: "translate(-50%)" }}>{translate("copied")}</p>
                            </>
                        ) : (
                            <i className="fa-solid fa-link text-black"></i>
                        )
                    }
                </button>
                <Calendar user={user} profile_id={profile.id} />
            </div>
        )
    }

    const [showContent, setShowContent] = useState<any | undefined>(/*profile != undefined && profile.role == RoleType.ARTIST ? undefined : <Availabilities />*/ undefined);

    const Profile = () => {

        const showPolas = (profile.jobs.filter((job: any) => (job.name == "model" || job.name == "actor" || job.name == "appearing" || job.name == "dancer")).length > 0);
        const showPhotos = true;
        const showVideos = true;

        const shows = {
            polas: showPolas,
            photo: showPhotos,
            video: showVideos,
        }

        const [copied, setCopied] = useState(false);

        useEffect(() => {
            const timeout = setTimeout(() => {
                if (copied) setCopied(false);
            }, 1600);

            return () => clearTimeout(timeout);
        }, [copied]);

        const copyProfileLink = () => {
            const url = window.location.href.replace("#calendar", "");
            navigator.clipboard.writeText(url)
        }

        return (
            <div className="bg-light flex-grow-1 g-0 text-black">
                <div className="container not-mobile">
                    <div className="row m-0 gx-0 gx-md-3 gy-3 ">
                        <div className={"col-12  col-lg-4" + (showContent != undefined ? " d-none d-lg-block" : "")}>
                            <div className="bg-white border border-bottom-0 border-1 d-flex flex-column gap-0">
                                <button style={{ width: "70px" }} type="button" onClick={(e) => { setCopied(true); copyProfileLink() }} className={"position-relative button-copy-link " + (copied ? "clicked" : "") + " ms-auto bg-transparent border-0 p-3 fs-3"}>
                                    {
                                        copied ? (
                                            <>
                                                <i style={{ color: "var(--bs-green" }} className="fa-solid fa-check "></i>
                                                <p className="fs-6 position-absolute fw-semibold text-black" style={{ bottom: "50%", left: "50%", transform: "translate(-50%)" }}>{translate("copied")}</p>
                                            </>
                                        ) : (
                                            <i className="fa-solid fa-link text-black"></i>
                                        )
                                    }
                                </button>
                                <div className="d-flex flex-column">
                                    {
                                        profile.picture != null ?
                                            (
                                                <Image width={200} height={200} className="mx-auto profile-picture" src={buildMediaURL(profile.picture)} alt={profile.firstname + " " + profile.lastname} />
                                            ) : (
                                                <i style={{ fontSize: "6rem" }} className="text-center text-black me-2 fa-solid fa-circle-user"></i>
                                            )
                                    }
                                    <div className="my-3 d-flex flex-column">
                                        {(user != undefined && user.isAdmin && profile.isAdmin) && (
                                            <span className="text-white px-3 fw-semibold text-uppercase fs-5 text-center" style={{ backgroundColor: "var(--bs-red)" }}>{translate("administrator")}</span>
                                        )}
                                        {(user != undefined && user.isAdmin && profile.banned) && (
                                            <span className="text-white px-3 fw-semibold text-uppercase fs-5 text-center" style={{ backgroundColor: "var(--bs-red)" }}>{translate("has_banned")}</span>
                                        )}
                                        {(user != undefined && user.isAdmin && profile.subscription) && (
                                            <span className="text-white px-3 fw-semibold text-uppercase fs-5 text-center" style={{ backgroundColor: "var(--bs-primary)" }}>{translate("subscribed")}</span>
                                        )}
                                    </div>
                                    <h1 className="fs-3 text-center fw-semibold pt-3 text-initial">{profile.firstname} {profile.lastname}</h1>
                                    <div className="mx-auto">
                                        <ul className="list-unstyled">
                                            <li><i className="fa-solid fa-location-dot me-2 fs-5"></i> {profile.city}, {translate(CountriesHandler.getCountryCommon(profile.country))}</li>
                                            {profile.body != null && (
                                                <li><i className="fa-solid fa-chart-bar me-2 fs-5"></i> {profile.body.height} cm</li>
                                            )}
                                            <li>{gendersIcons[profile.gender]} {genders[profile.gender]}</li>
                                            {profile.body != null && (
                                                <li><i className="fa-solid fa-globe me-2 fs-5"></i>{translate(ethnics[profile.body.ethnic])}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                {profile.email != undefined && (
                                    <div className="border-top p-2 px-4 d-flex">
                                        <i className="fa-solid fa-envelope my-auto"></i>
                                        <a className="text-black text-center w-100 lh-1" href={"mailto:" + profile.email}>{profile.email}</a>
                                    </div>
                                )}
                                {
                                    profile.phone != undefined && (
                                        <div className="border-top p-2 px-4 d-flex">
                                            <i className="fa-solid fa-phone my-auto"></i>
                                            <a className="text-black text-center w-100 lh-1" href={"tel:" + profile.phone}>{profile.phone}</a>
                                        </div>
                                    )
                                }
                                <div className="d-none d-lg-block">
                                    <ProfileDetails />
                                    <ProfileInformations />
                                </div>
                                {
                                    profile != undefined && profile.role == RoleType.RECRUITER && (
                                        <div className="d-block d-lg-none">
                                            <ProfileDetails />
                                        </div>
                                    )
                                }
                            </div >
                        </div >
                        <div className="col-12 col-lg-8">
                            {profile != undefined && profile.role == RoleType.ARTIST && (
                                <div className={"bg-white border " + (showContent == undefined ? "h-100" : "")}>
                                    {showContent != undefined ? (
                                        <div className="col-12 bg-white">
                                            {showContent}
                                        </div>
                                    ) : (
                                        <>
                                            {(profile.polas.length == 0 && profile.photos.length == 0 && profile.videos.length == 0) ?
                                                (
                                                    <div className="h-100 p-4" style={{ minHeight: "300px" }}>
                                                        <div className="border w-100 h-100 d-flex justify-content-center align-items-center border-black border-dashed">
                                                            <span className="fs-5"><em>{translate("galery_emtpy")}</em></span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex flex-column gap-3 py-3">
                                                        {(showPolas && profile.polas.length > 0) && (
                                                            <Polas />
                                                        )}
                                                        {(showPhotos && profile.photos.length > 0) && (
                                                            <Photos />
                                                        )}
                                                        {(showVideos && profile.videos.length > 0) && (
                                                            <Videos />
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {(hasProfileInformations() && profile != undefined && profile.role != RoleType.RECRUITER) && (
                            <div className={"d-block d-lg-none col-12 col-lg-4" + (showContent != undefined ? " d-none d-lg-block" : "")}>
                                <div className="bg-white border border-bottom-0 border-1">
                                    <ProfileDetails />
                                    <div className="d-flex flex-column pt-3">
                                        <ProfileInformations />
                                    </div>
                                </div >
                            </div >
                        )}
                    </div>
                </div>
            </div >
        )
    }

    const openCalendar = () => {
        setShowContent(<Availabilities />)
    }

    useEffect(() => {
        if (profile != undefined && profile.role == RoleType.RECRUITER) return;
        const url = window.location.href;
        if (url.endsWith("#calendar")) {
            openCalendar();
        }
    }, [])

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={profile && profile.description} />
            </Head>

            {
                showImage != undefined && (
                    <div style={{ zIndex: 999999, backgroundColor: "rgba(0, 0, 0, 1)", backdropFilter: "blur(4px)" }} className="fixed-top top-0 bottom-0 start-0 end-0">
                        <button className="position-absolute top-0 end-0 m-2 border-0 bg-transparent fs-1 text-white me-4" onClick={(e) => setShowImage(undefined)}>
                            <i className="fa-solid fa-close"></i>
                        </button>
                        <div className="postion-relative w-100 h-100 p-1 p-xl-5">
                            <img src={showImage} alt="" className="object-fit-contain w-100 h-100" />
                            {/*
                            <img src="/assets/imgs/logo.svg" className="position-absolute top-0 start-0 m-2 bg-black p-3" />
                            */}
                        </div>
                    </div>
                )
            }
            <Navbar footerButtons={false} lang={lang} user={user} fixedTop={true}>
                <div className="bg-light pt-4">
                    <div className="container">
                        <div className="row m-0 gx-0    ">
                            <div className="col-12 col-md d-flex align-items-center">
                                <span>
                                    <i className="fa-solid fa-chevron-left me-2"></i>
                                    {
                                        showContent == undefined || (showContent != undefined && profile != undefined && profile.role == RoleType.RECRUITER) ? (
                                            <>
                                                {
                                                    profile != undefined && profile.role == RoleType.ARTIST ? (
                                                        <Link className="text-black text-clickable" href={buildRoute(lang, PROFILES_SEARCH)}>{translate("back_to_search_results")}</Link>
                                                    ) : (
                                                        <Link className="text-black text-clickable" href={buildRoute(lang, LISTINGS)}>{translate("back_to_ads")}</Link>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <button type="button" onClick={(e) => setShowContent(undefined)} className="ms-0 p-0 bg-transparent border-0 text-black text-clickable">{translate("back_to_profile")}</button>
                                        )
                                    }
                                </span>
                            </div>
                            <div className="col-12 col-md-auto d-flex justify-content-md-end mt-3 mt-md-0">
                                {
                                    (user && user.isAdmin) && (
                                        <div className="dropdown w-100">
                                            <button className="btn btn-secondary w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {translate("manage_account")}
                                            </button>
                                            <ul className="dropdown-menu">
                                                {
                                                    !profile.isAdmin ? (
                                                        <li><a className="dropdown-item" href="?admin=true">{translate("set_as_administrator")}</a></li>
                                                    ) : (
                                                        <li><a className="dropdown-item" href="?admin=false">{translate("set_as_user")}</a></li>
                                                    )
                                                }
                                                {
                                                    !profile.subscription && (
                                                        <li><a className="dropdown-item" href="?give_subscription=true">{translate("offer_subscription")}</a></li>
                                                    )
                                                }
                                                {
                                                    !profile.banned ? (
                                                        <li><a className="dropdown-item" href="?banned=true">{translate("suspend_account")}</a></li>
                                                    ) : (
                                                        <li><a className="dropdown-item" href="?banned=false">{translate("remove_suspend")}</a></li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar >
            {profile == null ?
                (
                    <div className="flex-grow-1 bg-light">
                        <div className="container d-flex flex-column py-5 text-center">
                            <i className="fa-solid fa-user fs-1 mt-5"></i>
                            <NotFound />
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow-1 bg-light d-flex flex-column pb-5">
                        <Profile />
                    </div>
                )
            }
            <Footer lang={lang} />
            {profile != undefined && (user != undefined && profile.id != user.profile.id) && (
                <div style={{ zIndex: 999 }} className="sticky-bottom bottom-0 start-0 end-0 py-3 bg-white border-top">
                    <div className="container not-mobile">
                        <div className="row m-0 align-items-center justify-content-center gx-2 gy-2">
                            <p className="d-none d-lg-inline fs-6 mb-0 pe-3 col">{translate("popup_message_profile")}</p>
                            {
                                (profile != undefined && profile.role == RoleType.ARTIST) && (
                                    <a href="#calendar" onClick={(e) => openCalendar()} className="btn btn-white fs-6 fw-semibold d-flex align-items-center px-2 px-md-3 col-auto">
                                        <i className="fa-regular fa-calendar me-3 fs-5"></i>
                                        {translate("check_availabilities")}
                                    </a>
                                )
                            }
                            <Link
                            className="ms-1 btn btn-black fs-6 fw-semibold d-flex align-items-center col-auto px-2 px-md-3"
                            href={profile != undefined ? buildRoute(lang, ME_CHAT + "?open=" + profile.id) : ""}
                            >
                            <span>
                                <i className="fa-regular fa-message me-3 fs-5"></i>
                                {translate("contact_request")}
                            </span>
                            </Link>
                            {/* <Link className="ms-1 btn btn-black fs-6 fw-semibold d-flex align-items-center col-auto px-2 px-md-3" href={profile != undefined ? buildRoute(lang, ME_CHAT + "?open=" + profile.id) : ""}>
                                <i className="fa-regular fa-message me-3 fs-5"></i>
                                {translate("contact_request")}
                            </Link> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(context: any) {
    const { Profile } = require("../../../../models/");
    const datas = await ServerSide.getServerSideProps(context, "profile_not_found");

    let props: any = {
        ...datas,
        profile: null
    }

    try {
        const i = context.req.url.split("/");
        const [firstname, lastname, id] = i[i.length - 1].split("-");

        if (!(firstname == undefined || lastname == undefined || id == undefined)) {
            const profile = await Profile.findOne({
                where: {
                    firstname: {
                        [Op.like]: firstname
                    },
                    lastname: {
                        [Op.like]: lastname
                    },
                    id
                },
                attributes: { exclude: ["profile_id"] }
            });

            if (profile == null) {
                return { props };
            }

            const userOfProfile = await profile.getUser();
            if (datas.user != null) {
                const user = JSON.parse(datas.user);
                if (user.isAdmin) {
                    if (userOfProfile) {
                        const { banned, give_subscription, admin } = context.query;

                        if (banned && !userOfProfile.isAdmin) {
                            await userOfProfile.update({ banned });
                        }

                        if (admin) {
                            await userOfProfile.update({ isAdmin: admin });
                        }

                        if (give_subscription) {
                            await profile.freeSubscription();
                        }
                    }
                }
            } else {
                if (await userOfProfile.banned) {
                    return { props };
                }
                /**
                 * Faire la même chose ici si il n'y a pas d'abonnement 
                 */
            }

            const profileData = { ...(await ProfileBuilder.build(profile)), isAdmin: await userOfProfile.isAdmin, banned: await userOfProfile.banned }

            let travels: string[] = [];
            let dont_travels: string[] = [];

            try {
                for (const cca2 of profileData.travels) {
                    const common = getCountries.filter((country) => country.cca2 == cca2)[0].common;
                    travels = [...travels, common];
                }
                for (const cca2 of profileData.dont_travels) {
                    const common = getCountries.filter((country) => country.cca2 == cca2)[0].common;
                    dont_travels = [...dont_travels, common];
                }
            } catch (error) {
                console.error(error)
            }

            props = {
                ...props,
                title: "FIND.ME | " + profileData.firstname + " " + profileData.lastname,
                profile: JSON.stringify(profileData),
                travels,
                dont_travels
            }
        }
    } catch (error) {
        console.error(error);
    }
    return { props };
}

