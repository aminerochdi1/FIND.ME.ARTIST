import Image from 'next/image'
import { useTranslation } from 'react-i18next';
import LinksSelector from './LinksSelector';
import { push, LOGOUT, ACCOUNT_SETTINGS, PROFILES_SEARCH, AD, ME_ADS, ME_CALENDAR, buildRoute, ME_CHAT, buildProfileRoute, ADMINISTRATION } from "@/handler/router"
import { useRouter } from 'next/router';
import { RoleType } from '@/classes/RoleType';
import { buildMediaURL } from '@/utils/client.utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ChatAPI from '@/api/ChatAPI';
import { getSession } from '@/handler/session';
import path from 'path';

export default function Navbar(props: { lang: string, children?: any, fixedTop?: boolean, user?: any, footerButtons?: boolean }) {

    const user = props.user;
    const fixedTop = props.fixedTop != undefined ? props.fixedTop : false;
    const router = useRouter();
    const language = props.lang;
    const footerButtons = props.footerButtons ?? true;

    const logout = () => {
        push(router, language, LOGOUT)
    }

    const translate = useTranslation().t;

    const navigations = [
        { name: "home", path: "" },
        { name: "search", path: PROFILES_SEARCH },
        { name: "ads", path: "/listings" }
    ]

    const { ARTIST } = RoleType;

    const [hasMessages, setHasMessages] = useState<number>(0)

    useEffect(() => {
        if (user == undefined) return;
        const fetch = async () => {
            const hasMessages = await ChatAPI.hasMessages(getSession());
            setHasMessages(hasMessages);
        }
        fetch();
        const interval = setInterval(() => {
            //fetch();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [user])

    const Notification = () => {
        return (
            <>
                {
                    hasMessages > 0 && (
                        <div className="notification text-white small">{hasMessages}</div>
                    )
                }
            </>
        )
    }

    let links: any[] = [];
    if (user != undefined) {
        links = [
            {
                translate: "my_profile",
                link: buildProfileRoute(language, user.profile.firstname, user.profile.lastname, user.profile.id),
                onClick: (e: any) => {
                    push(router, language, "/profile/" + user.profile.firstname + "-" + user.profile.lastname + "-" + user.profile.id)
                }
            },
            {
                translate: "messaging",
                link: buildRoute(language, ME_CHAT),
                onClick: (e: any) => {
                    push(router, language, ME_CHAT)
                },
                html: <Notification />
            },
            {
                translate: "calendar",
                link: buildRoute(language, ME_CALENDAR),
                onClick: (e: any) => {
                    push(router, language, ME_CALENDAR)
                }
            },
            {
                translate: "my_ads",
                link: buildRoute(language, ME_ADS),
                onClick: (e: any) => {
                    push(router, language, ME_ADS)
                }
            },
            {
                translate: "settings",
                link: buildRoute(language, ACCOUNT_SETTINGS),
                onClick: (e: any) => {
                    push(router, language, ACCOUNT_SETTINGS)
                }
            },
            {
                translate: "administration",
                link: buildRoute(language, ADMINISTRATION),
                onClick: (e: any) => {
                    push(router, language, ADMINISTRATION)
                }
            },
            {
                translate: "logout",
                link: buildRoute(language, LOGOUT),
                onClick: (e: any) => {
                    logout();
                }
            }
        ]
            .filter((link) => link.translate == "my_ads" ? user != undefined && user.profile.role == RoleType.RECRUITER : true)
            .filter((link) => link.translate == "administration" ? user != undefined && user.isAdmin : true)
            .filter((link) => link.translate == "calendar" ? user != undefined && user.profile.role != RoleType.RECRUITER : true)
    }

    const langs = [
        {
            lang: "FR",
            name: "french"
        },
        {
            lang: "EN",
            name: "english"
        }
    ]

    const [show, setShow] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isBlack = () => {
        return fixedTop || (fixedTop && scrolled);
    }

    const { pathname } = router;

    return (
        <>
            {
                (user && user.profile.role != RoleType.RECRUITER && !user.profile.subscription && !pathname.endsWith("/[lang]")) && (
                    <a href={buildRoute(props.lang, "/account/settings")} className="text-decoration-none w-100 text-white fw text-center px-5 py-1 small fw-semibold" style={{ backgroundColor: "var(--bs-primary)" }}>
                        {translate("subscription_alert")}
                    </a>
                )
            }
            {
                (user && user.banned && !pathname.endsWith("/[lang]")) && (
                    <a href={buildRoute(props.lang, "/contact")} className="text-decoration-none w-100 text-white fw text-center px-5 py-1 small fw-semibold" style={{ backgroundColor: "var(--bs-red)" }}>
                        {translate("banned_alert")}
                    </a>
                )
            }
            <nav style={{ zIndex: 999 }} className={((fixedTop && scrolled) && (props.children != undefined && " border-bottom border-gray ") + (fixedTop ? " sticky-top " : "")) + " navbar navbar-expand-lg navbar-phone top-0 start-0 end-0 " + (!fixedTop && " position-absolute ") + (isBlack() && (" bg-white text-black"))} >
                <div className="container not-mobile ">
                    <div className="d-flex flex-column w-100 pb-2 pt-3 pt-md-0">
                        <nav className="navbar navbar-expand-lg d-flex align-items-center w-100 py-0">
                            <Link href={buildRoute(props.lang, "/")} className="ps-3 ps-lg-0">
                                <Image src={isBlack() ? "/assets/imgs/logo-black.svg" : "/assets/imgs/logo.svg"} alt="Findme" width={160} height={100} />
                            </Link>
                            <button className="pe-3 pe-lg-0 ms-auto bg-transparent border-0 d-block d-lg-none" type="button" onClick={(e) => setShow((show) => !show)} data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                                <svg width="45" height="33" viewBox="0 0 45 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="45" height="5" fill={(!isBlack() ? "white" : "black")}></rect>
                                    <rect x="18" y="14" width="27" height="5" fill={(!isBlack() ? "white" : "black")}></rect>
                                    <rect y="28" width="45" height="5" fill={(!isBlack() ? "white" : "black")}></rect>
                                </svg>
                            </button>

                            <div className={"mt-3 mt-lg-0 pt-lg-0 mx-auto collapse navbar-collapse align-items-center" + (show ? " show bg-white" : "")} id="navbar">
                                <ul className="navbar-nav mx-auto px-2 px-md-0">
                                    {/*
                                        language == "fr" ?
                                            (
                                                <li className="nav-item mx-3 ">
                                                    <a className={"nav-link text-" + (isBlack() || show ? "black" : "white")} href={router.asPath.replace("fr", "en")}>🇬🇧 {translate("en")}</a>
                                                </li>
                                            ) : (
                                                <li className="nav-item mx-3 ">
                                                    <a className={"nav-link text-" + (isBlack() || show ? "black" : "white")} href={router.asPath.replace("en", "fr")}>🇫🇷 {translate("fr")}</a>
                                                </li>
                                            )
                                            */
                                    }
                                    {
                                        navigations.map((navigation, index) => {
                                            const navigationRoute = "/" + language + "/" + navigation.path;
                                            const active = router.pathname.replace("/[lang]", "") == (navigation.path);
                                            return (
                                                <li className="nav-item mx-3 " key={index}>
                                                    <a aria-current={active ? "page" : undefined} className={"nav-link text-" + (isBlack() || show ? "black" : "white") + " " + (active ? (isBlack() ? "active primary" : "active") : "")} href={navigationRoute}>{translate(navigation.name)}</a>
                                                </li>
                                            )
                                        })
                                    }
                                    {
                                        user != undefined && links.map((navigation, index) => {
                                            const navigationRoute = navigation.link;
                                            const active = router.pathname.replace("/[lang]", "") == (navigation.link);
                                            return (
                                                <li className="d-inline d-lg-none nav-item mx-3 d-flex" key={index}>
                                                    <a aria-current={active ? "page" : undefined} className={"nav-link w-100 d-flex text-" + (isBlack() || show ? "black" : "white") + " " + (active ? (isBlack() ? "active primary" : "active") : "")} href={navigationRoute}>
                                                        {translate(navigation.translate)}
                                                        <span className="ms-auto">
                                                            {navigation.html != undefined && (
                                                                navigation.html
                                                            )}
                                                        </span>
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                {user ? (
                                    <div className="d-none d-lg-block">
                                        <LinksSelector links={links}>
                                            <div className="px-3 d-flex gap-2 align-items-center">
                                                {
                                                    user.profile.picture != null ? (
                                                        <Image width={50} height={50} className="profile-picture" src={buildMediaURL(user.profile.picture)} alt="My profile picture" />
                                                    ) : (
                                                        <i className={"fs-1 me-2 fa-solid fa-circle-user " + (isBlack() ? "text-black" : "text-white")}></i>
                                                    )
                                                }
                                                <div className={"d-flex flex-column " + (isBlack() && ("text-black"))}>
                                                    <span className="mt-0 pt-0 lh-1 fw-bold fs-5 text-uppercase">{user.profile.firstname} {user.profile.lastname}</span>
                                                    {user.isAdmin ? (
                                                        <div>
                                                            <span className={"mt-0 lh-sm fw-semibold highlight " + (isBlack() && ("highlight-danger"))}>{translate("my_administrator_space")}</span>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className={"mt-0 lh-sm fw-semibold highlight " + (isBlack() && ("highlight-primary"))}>{translate(user.profile.role == ARTIST ? "my_artist_space" : "my_recruiter_space")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </LinksSelector>
                                    </div>
                                ) : (
                                    <div className="d-none d-lg-flex gap-2 text-no-wrap">
                                        <a href={"/" + language + "/signin"} className={"btn btn-sm btn-black " + (!isBlack() && "border border-white")}>{translate("login")}</a>
                                        <a href={"/" + language + "/signup"} className={"btn btn-sm btn-light " + (isBlack() && "border border-black")}>{translate("register")}</a>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div >
                </div >
            </nav >
            {
                props.children != undefined && (
                    props.children
                )
            }
            {
                (user == undefined && footerButtons) && (
                    <div className="pt-5 d-block d-lg-none fixed-bottom">
                        <div className=" w-100 text-no-wrap row m-0 gx-0">
                            <div className="col-6 ">
                                <a href={"/" + language + "/signin"} className={"btn btn-black w-100 py-3"}>{translate("login")}</a>
                            </div>
                            <div className="col-6 ">
                                <a href={"/" + language + "/signup"} className={"btn btn-light w-100 py-3"}>{translate("register")}</a>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}