import Image from 'next/image'
// import { Inter } from 'next/font/google'
import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchLang } from '@/utils/client.utils';
import { getSessionWithServerSideProps, removeSession } from '@/handler/session';
import { ClientSide } from '@/sides/client/ClientSide';
import { buildRoute } from '@/handler/router';
import { ServerSide } from '@/sides/server/ServerSide';
import Footer from '@/components/Footer';
import jwtUtils from '@/utils/jwt.utils';

export default function Logout(props: { lang: string, title: string }) {

    const translate = useTranslation().t;
    ClientSide.setLanguage(props.lang)

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={props.lang} />
            <header className="header bg-black vh-100 text-white">
                <div className="vh-100 d-flex justify-content-center align-items-center">
                    <div className="col-11 col-md-10 col-xl-5 p-5 text-center blur border border-white">
                        <h1 className="pb-3 fs-4">{translate("confirmation_success")}</h1>
                        <p>{translate("you_account_is_confirmed")}</p>
                        <hr />
                        <Link href={buildRoute(props.lang, "/signin")} className="mt-3 fw-semibold btn border-white fs-4 btn-primary">
                            {translate("go_to_login")
                            }
                            <i className="fa-solid fa-chevron-right ms-2"></i>
                        </Link>
                    </div>

                </div>
            </header>
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const datas = await ServerSide.getServerSideProps(context, "logout");

    const { confirmation_token } = context.query;

    // if (confirmation_token != undefined) {
    //     const sessionDecoded = jwtUtils.verifySession(confirmation_token);
    //     if (sessionDecoded) {
    //     const email = sessionDecoded;

    //         const { User } = require("../../../models")
    //         const user = await User.findOne({
    //             where: {
    //                 email,
    //                 confirmation_token
    //             }
    //         });
    //         if (user) {
    //             await user.update({ confirmation_token: null });

    //             return {
    //                 props: {
    //                     ...datas
    //                 }
    //             }
    //         }
    //     }
    // }

    return ServerSide.getRedirectionWithoutLanguage(context);
}
