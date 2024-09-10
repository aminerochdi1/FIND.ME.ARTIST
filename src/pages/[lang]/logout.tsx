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

export default function Logout(props: { lang: string, title: string }) {

    const translate = useTranslation().t;
    ClientSide.setLanguage(props.lang)

    const router = useRouter();

    useEffect(() => {
        const logout = () => {
            removeSession();
            router.push("/" + props.lang + "/")
        }
        logout();
    }, [router, props.lang])

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={props.lang} />
            <header className="header bg-black vh-100 text-white">
                <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                    <div className="col-11 col-md-10 col-xl-5 p-5 text-center blur border border-white">
                        <h1 className="pb-3 fs-4">{translate("you_are_disconnected")}</h1>
                        <hr />
                        {/* <Link href={buildRoute(props.lang, "/")} className="mt-3 fw-semibold btn border-white fs-4 btn-primary">
                            <i className="fa-solid fa-chevron-left me-2"></i>
                            {translate("back_to_home")
                            }</Link> */}
                    </div>

                </div>
            </header>
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const datas = await ServerSide.getServerSideProps(context, "logout");

    if (datas.user == null)
        return {
            redirect: {
                destination: "/" + datas.lang,
                permenant: false
            }
        }

    return {
        props: {
            ...datas
        }
    }
}
