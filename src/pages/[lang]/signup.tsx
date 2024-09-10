import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import config from "../../config.json"
import { useEffect, useState } from 'react';
import getCountries from "@/assets/countries.json"
import ButtonsSelector from '@/components/ButtonsSelector';
import TextInputTags from '@/components/TextInputTags';
import Input from '@/components/Input';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import { useRouter } from 'next/router';
import checkerUtils from '@/utils/checker.utils';
import { getSessionWithServerSideProps } from '@/handler/session';
import { RoleType } from '@/classes/RoleType';
import { ClientSide } from '@/sides/client/ClientSide';
import { fetchCitiesData } from '@/api/CitiesAPI';
import { CGU, buildRoute } from '@/handler/router';
import Image from 'next/image';

export default function SignUp(props: { lang: string, jobsList: any[] }) {

    const { lang, jobsList } = props;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    var genders: string[] = [];
    config.genders.map((gender) => {
        genders = [...genders, translate(gender)]
    })

    const { ARTIST, RECRUITER } = RoleType;

    const [role, setRole] = useState(-1);
    const [step, setStep_] = useState(0);
    const [success, setSuccess] = useState(false);

    const setStep = (index: number) => {
        if (index == 0) {
            setRole(-1)
        }
        setStep_(index);
    }

    const registration = (roleSelected: number) => {
        setRole(roleSelected);
        setStep(1);
    }

    const ProgressComponent = () => {
        return (<div className="d-flex gap-2">
            {steps.map((step_, index) => {
                if (index == 0) return;
                return <span key={index} className={"rounds" + (index <= step ? " active" : "")} />
            })}
        </div>)
    }

    const Main = () => {
        return (
            <>
                <h3 className="mb-5">{translate("register")}</h3>
                <div className="mt-3 d-flex flex-column gap-5 col-8">
                    <button onClick={(e) => registration(ARTIST)} className="btn btn-primary fs-4 fw-bold border border-white">
                        <div className="d-flex flex-column py-4">
                            {translate("i_am_an_artist")}
                            <span className="fs-6">{config.price}€ / {translate("per_year")}</span>
                        </div>
                    </button>
                    <button onClick={(e) => registration(RECRUITER)} className="btn btn-light fs-4 fw-bold border border-black">
                        <div className="d-flex flex-column py-4">
                            {translate("i_am_an_recruiter")}
                            <span className="fs-6">{translate("for_free")}</span>
                        </div>
                    </button>
                </div>
            </>)
    }

    const SignUpHeader = () => {
        return (
            <div className="mb-5 d-flex flex-column justify-content-center">
                <h3 className="mb-0 lh-0">{translate("signup")}</h3>
                <div className="mt-3 mx-auto">
                    <ProgressComponent />
                </div>
            </div>
        )
    }


    const Navigation = (props: { onNext: any, canNext: boolean }) => {
        return (
            <>
                <div className="col-6 mt-3">
                    <button onClick={(e) => setStep(step - 1)} className="w-100 d-flex btn btn-thirdy fs-6 btn-primary">
                        <svg className="me-auto icon-arrow my-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                        </svg>
                        <span className="me-auto py-2">
                            {translate("back")}
                        </span>
                    </button>
                </div>
                <div className="col-6 mt-3">
                    <button type={step == steps.length - 1 ? "submit" : "button"} disabled={!props.canNext} onClick={(e) => { props.onNext(); if (step + 1 < steps.length) setStep(step + 1) }} className="w-100 d-flex btn btn-thirdy fs-6 btn-primary">
                        <span className="ms-auto py-2">
                            {
                                step == steps.length - 1 ?
                                    translate("finish") :
                                    translate("next")
                            }
                        </span>
                        <svg className="ms-auto icon-arrow my-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512">
                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                        </svg>
                    </button>
                </div>
            </>
        )
    }

    const [user, setUser] = useState<any>({});

    const StepOne = () => {

        const [jobs, setJobs] = useState<number[]>(user.jobs ? user.jobs : []);
        const [gender, setGender] = useState(user.gender != undefined ? user.gender : -1)
        const [firstname, setFirstname] = useState(user.firstname ? user.firstname : "");
        const [lastname, setLastname] = useState(user.lastname ? user.lastname : "");

        const [day, setDay] = useState<number | undefined>(user.born_date ? new Date(user.born_date).getDate() : undefined);
        const [month, setMonth] = useState<number | undefined>(user.born_date ? new Date(user.born_date).getMonth() : undefined);
        const [year, setYear] = useState<number | undefined>(user.born_date ? new Date(user.born_date).getFullYear() : undefined);

        const [canNext, setCanNext] = useState(false);

        const getAge = () => {
            if (user.born_date == undefined) return null;
            const current = new Date();
            const age: number = (current.getTime() - new Date(user.born_date).getTime()) / 1000 / 60 / 60 / 24 / 365.25;
            return age;
        }

        const [jobsDisabled, setJobsDisabled] = useState<string[]>([]);

        const updateUser = () => {
            if (jobs.length > 0) {
                let authorized: number[] = [];
                for (const jobSelectedIndex of jobs) {
                    const jobSelected: any = jobsList[jobSelectedIndex];

                    // authorized = [...authorized, ...checkerUtils.JOBS_AUTHORIZATIONS[jobSelected.name]]
                    if (checkerUtils.JOBS_AUTHORIZATIONS[jobSelected.name]) {
                        authorized = [...authorized, ...checkerUtils.JOBS_AUTHORIZATIONS[jobSelected.name]];
                    }
                }
                const disableds = jobsList.filter((job: any) => !authorized.includes(job.name) && !jobs.includes(jobsList.findIndex((job_: any) => job_.name == job.name))).map((job: any) => job.name);
                setJobsDisabled(disableds)
            } else {
                setJobsDisabled([]);
            }

            const user_ = user;
            user_.firstname = firstname;
            user_.lastname = lastname;
            if (year != undefined && month != undefined && day != undefined)
                user_.born_date = new Date(year, month - 1, day).toISOString();
            user_.gender = gender;
            user_.jobs = jobs.map((i) => jobsList[i].id);
            const age = getAge();
            setUser(user_)
        }

        const router = useRouter();
        const { pathname, query } = router;

        useEffect(() => {
            setCanNext(
                firstname.length > 0
                && lastname.length > 0
                && day != undefined && day > 0 && day <= 31
                && month != undefined && month > 0 && month <= 12
                && year != undefined
                && gender != -1
                && (role == ARTIST ? jobs.length > 0 : true)
            )
            updateUser();
        }, [firstname, lastname, day, month, year, jobs, gender]);

        return (
            <div className="pt-5 my-5 d-flex flex-column align-items-center justify-content-center ">
                <SignUpHeader />
                <div className="col-11 col-md-8 row g-2">
                    <div className="col-12 col-md-6">
                        <label className="form-label">{translate("firstname")}</label>
                        <Input required={true} emptyMessage={translate("input_is_empty")} value={firstname} onChange={(v: string) => setFirstname(v)} type="firstname" placeholder={"" + translate("your_firstname")} />
                    </div>
                    <div className="col-12 col-md-6 my-2">
                        <label className="form-label">{translate("lastname")}</label>
                        <Input required={true} emptyMessage={translate("input_is_empty")} value={lastname} onChange={(v: string) => setLastname(v)} type="lastname" placeholder={"" + translate("your_lastname")} />
                    </div>
                    <div className="col-12 mb-2">
                        <label className="form-label">{translate("birthday")}</label>
                        <div className="d-flex gap-2">
                            <Input required={true} emptyMessage={translate("input_is_empty")} value={day} onChange={(v: string) => setDay(parseInt(v))} type="number" min={0} max={31} placeholder="DD" />
                            <Input required={true} emptyMessage={translate("input_is_empty")} value={month} onChange={(v: string) => setMonth(parseInt(v))} type="number" min={0} max={12} placeholder="MM" />
                            <Input required={true} emptyMessage={translate("input_is_empty")} value={year} onChange={(v: string) => setYear(parseInt(v))} type="number" min={0} max={new Date().getFullYear()} placeholder="YYYY" />
                        </div>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">{translate("gender")}</label>
                        <ButtonsSelector value={gender} selected={(index: number) => { setGender(index) }} selection={genders} />
                    </div>
                    {
                        role == ARTIST && (
                            <>
                                <div className="mb-2">
                                    <label className="form-label">{translate("im_a")}</label>
                                    <TextInputTags not_found_message={translate("job_not_found")} value={jobs} onTags={(jobs: number[]) => { setJobs(jobs) }} ignores={jobsDisabled} suggestions={jobsList.map((job) => job.name)} placeholder={"" + translate("your_job")} />
                                </div>
                            </>
                        )
                    }
                    <Navigation onNext={updateUser} canNext={canNext} />
                </div>
            </div>
        );
    }

    const StepLast = () => {

        const countries = getCountries.map((country) => translate(country.common));
        const [cities, setCities] = useState<string[]>([]);
        const [citiesLoading, setCitiesLoading] = useState(false);
        const [cgu, setCGU] = useState(false);

        const fetchCities = async (index: number) => {
            setCitiesLoading(true);
            const cca2: string = getCountries[index].cca2;
            const citiesData: any = await fetchCitiesData(cca2)
            citiesData.forEach((city: any) => {
                setCities((cities) => [...cities, city.toponymName]);
            });
            setCitiesLoading(false);
        }

        const [canNext, setCanNext] = useState(false);

        const [country, setCountry] = useState<number>(user.country ? user.country : undefined);
        const [city, setCity] = useState<number>(user.city ? user.city : undefined);
        const [email, setEmail] = useState<string>(user.email ? user.email : undefined);
        const [password, setPassword] = useState<string>("");
        const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
        const [policyRespect, setPolicyRespect] = useState(true);
        const [errorMessage, setErrorMessage] = useState<string>()
        const [sending, setSending] = useState(false)

        const updateUser = () => {
            const user_ = user;
            user_.country = countries[country];
            user_.city = cities[city];
            user_.email = email;
            user_.password = password;
            user_.language = lang;
            setUser(user_);
        }

        const finish = async () => {
            setErrorMessage(undefined)
            setSending(true);
            updateUser();

            user.role = role;
            try {
                let user_: any = { ...user }
                user_.country = getCountries[country].cca2;
                const response = await fetch(config.API + "/user/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user_)
                });
                const responseData = await response.json();
                setSending(false);
                if (response.status >= 200 && response.status < 300) {
                    setSuccess(true);
                } else {
                    setErrorMessage(responseData.message);
                }
            } catch (err) {
                console.error(err);
            }
        }

        useEffect(() => {
            var policyRespect = false;
            if (password != undefined && password != "" && !checkerUtils.PASSWORD.test(password)) {
                policyRespect = false;
            } else {
                policyRespect = true;
            }
            setPolicyRespect(policyRespect)
            if (
                country != undefined
                && city != undefined
                && email !== undefined && email.includes("@") && checkerUtils.EMAIL.test(email)
                && password !== ""
                && passwordConfirmation != ""
                && password == passwordConfirmation
                && policyRespect
                && cgu) {
                setCanNext(true)
            } else {
                setCanNext(false)
            }

            updateUser();
        }, [country, city, email, password, passwordConfirmation, cgu])

        const choiceCountry = (index: number) => {
            fetchCities(index);
            setCountry(index)
        }

        const choiceCity = (index: number) => {
            setCity(index);
        }

        return (
            <div className="pt-5 my-5 d-flex flex-column align-items-center justify-content-center ">
                {SignUpHeader()}
                <div className="col-11 col-md-8 row g-2">
                    <div className="col-12 col-md-6">
                        <label className="form-label">{translate("country")}</label>
                        <SearchableSelectBox required={true} emptyMessage={translate("input_is_empty")} selected={country} select={(index: number) => choiceCountry(index)} not_found_message={translate("country_not_found")} elements={countries}>{translate("select_a_country")}</SearchableSelectBox>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label">{translate("city")}</label>
                        <SearchableSelectBox required={true} emptyMessage={translate("input_is_empty")} selected={city} select={(index: number) => { choiceCity(index) }} not_found_message={translate("city_not_found")} elements={cities}>{citiesLoading ? "Chargement..." : "Choisir une ville"}</SearchableSelectBox>
                    </div>
                    <div className="col-12 mb-2">
                        <label className="form-label">{translate("email")}</label>
                        <Input required={true} invalidRegex={translate("email_is_invalid")} regex={checkerUtils.EMAIL} emptyMessage={translate("input_is_empty")} value={email} onChange={(v: string) => setEmail(v)} type="email" placeholder={"" + translate("your_email")} />
                    </div>
                    <div className="col-12 mb-2">
                        <label className="form-label">{translate("password")}</label>
                        <Input required={true} emptyMessage={translate("input_is_empty")} value={password} onChange={(v: string) => setPassword(v)} type="password" placeholder={"" + translate("your_password")} />
                        <p className={(policyRespect ? "text-muted" : "text-danger") + " mt-1 small mb-0 lh-sm"}>{translate("password_policy")}</p>
                    </div>
                    <div className="col-12 mb-2">
                        <label className="form-label">{translate("confirm_password")}</label>
                        <Input required={true} emptyMessage={translate("input_is_empty")} value={passwordConfirmation} onChange={(v: string) => setPasswordConfirmation(v)} type="password" placeholder={"" + translate("your_confirm_password")} />
                        {
                            (password.length > 0 && passwordConfirmation.length > 0 && password !== passwordConfirmation) && (
                                <p className="text-danger mt-1 small mb-0 lh-sm">{translate("passwords_different")}</p>
                            )
                        }
                    </div>
                    {
                        errorMessage != undefined && (
                            <p className="text-danger mt-1 small mb-0 lh-sm">{translate(errorMessage)}</p>
                        )
                    }
                    <div className="col-12 mb-2">
                        <div className="d-flex align-items-center order-2 order-md-1 pt-2 pt-md-0  form-check">
                            <input checked={cgu} onChange={(e) => setCGU(e.target.checked)} type="checkbox" className="form-check-input mt-0 " id="cgu_checkbox" />
                            <label className="form-check-label ms-2" dangerouslySetInnerHTML={{ __html: translate("cgu_accept").replace("%link%", buildRoute(lang, CGU)) + "" }} htmlFor="cgu_checkbox"></label>
                        </div>
                    </div>
                    <Navigation onNext={finish} canNext={!sending && canNext} />
                </div>
            </div>
        )
    }

    const Success = () => {
        return (
            <div className="p-4 text-center">
                <h3 className="mb-4">Bienvenue <span className="text-primary">{user.firstname} {user.lastname}</span> !</h3>
                <p className="lh-sm">Votre compte à été bien crée avec succès</p>
            </div>
        )
    }

    const steps = [
        Main(),
        StepOne(),
        StepLast()
    ];

    return (
        <>
            <Head>
                <title>Find.me</title>
                <meta name="description" content="" />
            </Head>

            <Navbar footerButtons={false} lang={props.lang} />
            <section className="bg-secondary">
                <div className="row m-0 g-0 min-vh-100 background-login ">
                    <div className="col-6 d-none d-lg-block">
                        <div className="w-100 h-100 position-relative">
                            <Image className={(role == ARTIST || role == -1 ? "d-block" : "d-none") + " h-100 object-fit-cover"} width={0} height={0}  quality={100} sizes="100vw" style={{ zIndex: 2, objectFit: 'cover', }} src="/assets/illustrations/bg-home.webp" alt="women with a guitar" />
                            <Image className={(role == RECRUITER || role == -1 ? "d-block" : "d-none") + " h-100 object-fit-cover"} width={0} height={0}  quality={100} sizes="100vw" style={{ zIndex: 1, objectFit: 'cover', }} src="/assets/illustrations/recruiter.jpg" alt="man with a twin" />
                            <div style={{ zIndex: 2 }} className="position-absolute top-0 start-0 end-0 bottom-0 image-over"></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center  background-login text-white">
                        {success ? <Success /> : steps[step]}
                    </div>
                </div>
            </section>
        </>
    )
}


export async function getServerSideProps(context: any) {
    const user = await getSessionWithServerSideProps(context.req);
    const { lang } = context.query;

    if (user != null)
        return {
            redirect: {
                destination: "/" + lang,
                permenant: false
            }
        }

    const response = await fetch(config.API + "/jobs/all")
    const data = await response.json();
    const jobsList = data.jobs;

    return {
        props: {
            lang,
            jobsList
        }
    }
}