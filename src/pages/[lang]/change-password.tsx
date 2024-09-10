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
import { buildRoute, push } from '@/handler/router';
import UserAPI from '@/api/UserAPI';
import checkerUtils from '@/utils/checker.utils';
import Image from 'next/image';

export default function SignIn(props: { password_forget_token: string, lang: string }) {

    const router = useRouter();

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<string | undefined>("");

    const [policyRespect, setPolicyRespect] = useState(true);
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
        var policyRespect = false;
        if (password != undefined && password != "" && !checkerUtils.PASSWORD.test(password)) {
            policyRespect = false;
        } else {
            policyRespect = true;
        }
        setPolicyRespect(policyRespect)

        if (password !== ""
            && passwordConfirm != ""
            && password == passwordConfirm
            && policyRespect) {
            setCanNext(true)
        } else {
            setCanNext(false)
        }
    }, [password, passwordConfirm])

    const changePassword = async () => {
        const password_forget_token: string = props.password_forget_token;
        const response = await UserAPI.changePassword({ password_forget_token, password });

        if (response.message != "password_changed")
            return setError(response.message)

        setError(undefined)

        setTimeout(() => {
            push(router, props.lang, "/signin")
        }, 500)
    }

    const submit = (e: any) => {
        e.preventDefault();
        changePassword();
    }

    return (
        <>
            <Head>
                <title>Find.me</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={props.lang} />
            <section className="vh-100 bg-secondary top-0 bottom-0 start-0 end-0">
                <div className="row m-0 g-0 h-100  background-login ">
                    <div className="col-6 d-none d-lg-block">
                        <div className="w-100 h-100 position-relative">
                            <Image width={0} height={0} quality={100} sizes="100vw" style={{ objectFit: 'cover', }} src="/assets/illustrations/bg-home.webp" alt="" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 image-over"></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="h-100 background-login d-flex flex-column align-items-center justify-content-center text-white">
                            <Link href={buildRoute(props.lang, "/signin")} className="text-decoration-none text-clickable me-auto ps-3 pb-3 text-white">
                                <i className="fa-solid fa-chevron-left me-2"></i>
                                {translate("back")}
                            </Link>
                            <h3 className="mb-5 display-6 fw-bold text-center px-5">{translate("new_password")}</h3>
                            <p className="text-center px-5">{translate("edit_password_message")}</p>
                            <form className="mt-3 d-flex flex-column col-11 col-md-8" action="" onSubmit={(e) => { submit(e) }}>
                                <div className="col-12 mb-4">
                                    <label className="form-label">{translate("password")}</label>
                                    <Input value={password} onChange={(v: string) => setPassword(v)} type="password" placeholder={"" + translate("your_password")} />
                                    <p className={(policyRespect ? "text-muted" : "text-danger") + " mt-1 small mb-0 lh-sm"}>{translate("password_policy")}</p>
                                </div>
                                <div className="col-12 mb-2">
                                    <label className="form-label">{translate("confirm_password")}</label>
                                    <Input value={passwordConfirm} onChange={(v: string) => setPasswordConfirm(v)} type="password" placeholder={"" + translate("your_confirm_password")} />
                                    {
                                        (password.length > 0 && passwordConfirm.length > 0 && password !== passwordConfirm) && (
                                            <p className="text-danger mt-1 small mb-0 lh-sm">{translate("passwords_different")}</p>
                                        )
                                    }
                                </div>
                                {
                                    (error != undefined && error != "") && (
                                        <span className="text-danger">{translate(error)}</span>
                                    )
                                }
                                {
                                    (error == undefined) && (
                                        <span className="text-success">{translate("password_changed")}</span>
                                    )
                                }
                                <button type="submit" disabled={!canNext} className="mt-4 btn btn-lg btn-login">{translate("edit_password")}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const datas = await ServerSide.getServerSideProps(context, "change_password");

    const { password_forget_token } = context.query;/*

    if (datas.user != null || password_forget_token == undefined)
        return {
            redirect: {
                destination: "/" + datas.lang,
                permenant: false
            }
        }

    const { User } = require("../../../models")
    const user = await User.findOne({
        where: {
            password_forget_token
        }
    })

    if (user == undefined)
        return {
            redirect: {
                destination: "/" + datas.lang,
                permenant: false
            }
        }*/

    return { props: { lang: datas.lang, password_forget_token } }
}
