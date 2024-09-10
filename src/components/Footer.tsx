import { CGU, CGV, LEGAL_NOTICE, LISTINGS, PROFILES_SEARCH, SIGNIN, SIGNUP, buildRoute } from '@/handler/router';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = (props: { lang: string }) => {

    const translate = useTranslation().t;

    return (
        <div className="bg-white">
            <div className="container py-3">
                <div className="row justify-content-md-center bg-white text-black gx-5 gy-4 m-0">
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <div className="px-md-5 text-center text-md-start">
                            <span className="fw-bold fs-4 text-uppercase">Conditions</span>
                            <ul className="pt-3 list-unstyled ">
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, LEGAL_NOTICE)}>{translate("legal_notice")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, CGU)}>{translate("terms_and_conditions")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, CGV)}>{translate("terms_and_conditions_of_sale")}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <div className="px-md-5 text-center text-md-start">
                            <span className="fw-bold fs-4 text-uppercase mb-3">FINDME</span>
                            <ul className="pt-3 list-unstyled">
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, "")}>{translate("home")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, PROFILES_SEARCH)}>{translate("search")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, LISTINGS)}>{translate("ads")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, SIGNIN)}>{translate("login")}</Link></li>
                                <li className="lh-md"><Link className="text-decoration-none text-black" href={buildRoute(props.lang, SIGNUP)}>{translate("register")}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <div className="px-md-5 text-center text-md-start">
                            <span className="fw-bold fs-4 text-uppercase mb-3">Contact</span>
                            <ul className="pt-3 list-unstyled">
                                <li className="lh-md"><a className="text-primary text-clickable" href={"mailto:contact@findmeartist.com"}>contact@findmeartist.com</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-light pt-5 pb-3 d-flex flex-column align-items-center">
                <div className="pb-5 d-flex flex-column align-items-center">
                    <span className="text-dark mb-3">2023 FIND.ME, All rights reserved. </span>
                    <Link href={buildRoute(props.lang, "/")}>
                        <Image src={"/assets/imgs/logo-black.svg"} alt="Findme" width={180} height={130} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;