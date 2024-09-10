// import { Inter } from 'next/font/google'
import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Input from '@/components/Input';
import { useEffect, useState } from 'react';
import config from "../../config.json"
import { getSessionWithServerSideProps, setSession, setTempSession } from '@/handler/session';
import { useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';
import { ServerSide } from '@/sides/server/ServerSide';
import { ClientSide } from '@/sides/client/ClientSide';
import { buildRoute } from '@/handler/router';
import UserAPI from '@/api/UserAPI';
import checkerUtils from '@/utils/checker.utils';

export default function SignIn(props: { lang: string }) {

    const router = useRouter();

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const [email, setEmail] = useState("");
    const [error, setError] = useState<string|undefined>("");

    const forget = async () => {
        const response = await UserAPI.passwordForget(email, props.lang);

        if(response.message != "password_forget_email_has_been_send")
            return setError(response.message)
        
        setError(undefined)
    }

    const submit = (e: any) => {
        e.preventDefault();
        forget();
    }

    return (
        <>
            <Head>
                <title>Find.me</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={props.lang} />
            <section className="vh-100 bg-secondary top-0 bottom-0 start-0 end-0">
                <div className="row m-0 g-0 h-100 background-login ">
                    <div className="col-6 d-none d-lg-block">
                        <div className="w-100 h-100 position-relative">
                            <img className="h-100 object-fit-cover" src="/assets/illustrations/bg-home.webp" alt="" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 image-over"></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="h-100 background-login d-flex flex-column align-items-center justify-content-center text-white">
                            <Link href={buildRoute(props.lang, "/signin")} className="text-decoration-none text-clickable me-auto ps-3 pb-3 text-white">
                                <i className="fa-solid fa-chevron-left me-2"></i>
                                {translate("back")}
                            </Link>
                            <h3 className="mb-5 display-6 fw-bold text-center px-5">{translate("password_forget_title")}</h3>
                            <p className="text-center px-5">{translate("password_forget_message")}</p>
                            <form className="mt-3 d-flex flex-column col-11 col-md-8" action="" onSubmit={(e) => { submit(e) }}>
                                <div className="mb-2">
                                    <label className="form-label">{translate("email")}</label>
                                    <Input disabled={error == undefined} name="email" value={email} onChange={(v: string) => { setEmail(v) }} type="email" placeholder={"" + translate("your_email")} />
                                </div>
                                {
                                    (error != undefined && error != "") && (
                                        <span className="text-danger">{translate(error)}</span>
                                    )
                                }
                                {
                                    (error == undefined) && (
                                        <span className="text-success">{translate("password_forget_email_has_been_send")}</span>
                                    )
                                }
                                <button type="submit" disabled={!checkerUtils.EMAIL.test(email) || error == undefined} className="mt-4 btn btn-lg btn-login">{translate("password_forget")}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const { user, lang } = await ServerSide.getServerSideProps(context, "password_forget");

    if (user != null)
        return {
            redirect: {
                destination: "/" + lang,
                permenant: false
            }
        }

    return { props: { lang } }
}
