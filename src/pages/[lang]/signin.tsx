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
import checkerUtils from '@/utils/checker.utils';
import Image from 'next/image';


// const inter = Inter({ subsets: ['latin'] })

export default function SignIn(props: { lang: string }) {

    const router = useRouter();

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [stayConnected, setStayConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [sending, setSending] = useState(false);

    const [canLogin, setCanLogin] = useState(false);

    useEffect(() => {
        setCanLogin(email.length > 0 && password.length > 0)
    }, [email, password])

    // [SignIN]


    
    const signin = async () => {
        setSending(true);

        setErrorMessage(undefined)
        try {
            const response = await fetch(config.API + "/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { email, password }
                )
            });
            const responseData = await response.json();
            setSending(false);
            if (response.status >= 200 && response.status < 300) {
                const { token } = responseData.session;

                if (stayConnected) {
                    setSession(token);
                } else {
                    setTempSession(token);
                }

                if (!responseData.user.profile.subscription)
                    router.push('/' + props.lang+"/account/settings");
                else
                    router.push('/' + props.lang);
            } else {
                setErrorMessage(responseData.message);
            }
            
        } catch (err) {
            console.error(err);
        }
}

    const submit = (e: any) => {
        e.preventDefault();
        signin();
    }

    return (
        <>
            <Head>
                <title>Find.me</title>
                <meta name="description" content="" />
            </Head>

            <Navbar footerButtons={false} lang={props.lang} />
            <section className="vh-100 bg-secondary top-0 bottom-0 start-0 end-0">
                <div className="row m-0 g-0 h-100  background-login ">
                    <div className="col-6 d-none d-lg-block">
                        <div className="w-100 h-100 position-relative">
                            <Image width={0} height={0}  quality={100} sizes="100vw" style={{ objectFit: 'cover', }} src="/assets/illustrations/bg-home.webp" alt="" />
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 image-over"></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="h-100 background-login d-flex flex-column align-items-center justify-content-center text-white">
                            <h3 className="mb-5 display-5 fw-bold">{translate("signin")}</h3>
                            <form className="mt-3 d-flex flex-column col-11 col-md-8" action="" onSubmit={(e) => { submit(e) }}>
                                <div className="mb-4">
                                    <label className="form-label">{translate("email")}</label>
                                    <Input required={true} invalidRegex={translate("email_is_invalid")} emptyMessage={translate("input_is_empty")} name="email" regex={checkerUtils.EMAIL} value={email} onChange={(v: string) => { setEmail(v) }} type="email" placeholder={"" + translate("your_email")} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">{translate("password")}</label>
                                    <Input required={true} emptyMessage={translate("input_is_empty")} name="password" value={password} onChange={(v: string) => { setPassword(v) }} type="password" placeholder={"" + translate("your_password")} />
                                </div>
                                <div className="mb-3 d-grid d-md-flex align-items-center py-0 form-check">
                                    <div className="d-flex align-items-center order-2 order-md-1 pt-2 pt-md-0">
                                        <input checked={stayConnected} onChange={(e) => setStayConnected(e.target.checked)} type="checkbox" className="form-check-input mt-0 " id="remember_me_checkbox" />
                                        <label className="form-check-label ms-2" htmlFor="remember_me_checkbox">{translate("remember_me")}</label>
                                    </div>
                                    {/* <Link href={buildRoute(props.lang, "/forgotten")} className="small pt-2 pt-md-0 text-white ms-auto order-1 order-md-2">{translate("password_forgotten")}</Link> */}
                                </div>
                                {
                                    errorMessage != undefined && (
                                        <p className="text-danger small mb-0 lh-sm mb-3">{translate(errorMessage)}</p>
                                    )
                                }
                                <button type="submit" disabled={!sending && !canLogin} className="btn btn-lg btn-login">{translate("login")}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const { user, lang } = await ServerSide.getServerSideProps(context);

    if (user != null)
        return {
            redirect: {
                destination: "/" + lang,
                permenant: false
            }
        }

    return { props: { lang } }
}