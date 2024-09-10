import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import Input from '@/components/Input';
import JobsAPI from '@/api/JobsAPI';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientSide } from '@/sides/client/ClientSide';
import getCountries from '@/assets/countries.json';
import { AD, LISTINGS, buildRoute, push } from '@/handler/router';
import TextInputTags from '@/components/TextInputTags';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import DateInput from '@/components/DateInput';
import EditorWithNoSSR from '@/components/EditorNoSSR';
import { fetchCitiesData } from '@/api/CitiesAPI';
import { AdsAPI } from '@/api/AdsAPI';
import { getSession } from '@/handler/session';
import { useRouter } from 'next/router';
import { RoleType } from '@/classes/RoleType';
import Footer from '@/components/Footer';

export default function Create(
    props: {
        host: string,
        lang: string,
        title: string,
        jobs: any[],
        user: any,
    }) {

    const user = ClientSide.parseUser(props.user);
    const jobs = props.jobs;
    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const countries = getCountries.map((country: any) => translate(country.common));
    const [cities, setCities] = useState<any[]>([]);

    /* FORM */
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [jobsSelected, setJobsSelection] = useState<number[]>([])
    const [country, setCountry] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [begin, setBegin] = useState<Date>(new Date())
    const [end, setEnd] = useState<Date>()

    /* CAN PUSH FORM */
    const [canPublish, setCanPublish] = useState(false);
    const [publishing, setPublishing] = useState(false);

    /* UPDATE IF CAN PUSH FORM */
    useEffect(() => {
        setCanPublish(
            title.length > 0 &&
            description.length > 0 &&
            jobsSelected.length > 0 &&
            country != undefined &&
            city != undefined &&
            begin != undefined && begin.getTime() > new Date().getTime() &&
            (end == undefined || (end != undefined && end.getTime() > new Date().getTime())) &&
            (end == undefined || (end != undefined && begin != undefined && end.getTime() > begin.getTime()))
        )
    }, [title, description, jobsSelected, country, city, begin, end])

    const router = useRouter();

    /* SEND CREATION OF AD */
    const onCreate = async () => {
        setPublishing(true)
        const { response, json } = await AdsAPI.createAds(getSession(), user.profile.id, title, description, country, city, jobsSelected.map((selection) => jobs[selection].id), begin.toISOString(), end != undefined ? end.toISOString() : undefined)
        if (response.status == 201) {
            push(router, lang, AD + "/" + json.ad_id)
        } else {
            console.error(response)
        }
        setPublishing(false)
    }

    const choiceCountry = async (country: string) => {
        setCountry(country)
        setCities(await fetchCitiesData(country))
    }

    /* HEADER BOTTOM NAVBAR */
    const Header = () => {
        return (
            <div className="container py-3">
                <div style={{ zIndex: 1 }} className="d-block d-lg-none">
                    <h1 className="text-center fs-1">{translate("create_a_advertisement")}</h1>
                </div>
                <div className="position-relative d-flex align-items-center     ">
                <Link style={{ zIndex: 2 }} href={buildRoute(lang, LISTINGS)} className="text-clickable text-black my-auto">
                <span className="d-flex align-items-center">
                    <i className="fa-solid fa-chevron-left me-2"></i>
                    {translate("back")}
                </span>
                </Link>
                                        <Link
                        style={{ zIndex: 2 }}
                        href={buildRoute(lang, LISTINGS)}
                        className="text-clickable text-black my-auto"
                        >
                        <span>
                            <i className="fa-solid fa-chevron-left me-2"></i>
                            {translate("back")}
                        </span>
                        </Link>
                    {/* <Link style={{ zIndex: 2 }} href={buildRoute(lang, LISTINGS)} className="text-clickable text-black my-auto">
                        <i className="fa-solid fa-chevron-left me-2"></i>
                        {translate("back")}
                    </Link> */}
                    <div style={{ zIndex: 1 }} className="d-none d-lg-block position-absolute top-0 bottom-0 end-0 start-0">
                        <h1 className="text-center fs-1">{translate("create_a_advertisement")}</h1>
                    </div>
                    <button onClick={(e) => (onCreate())} disabled={!canPublish || publishing} style={{ zIndex: 2 }} className="ms-auto btn btn-black">{translate("publish_advertisement")}</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
                {Header()}
            </Navbar>
            <div className="flex-grow-1 bg-light">
                <div className="container d-flex justify-content-center my-5">
                    <div className="col-12 col-lg-8 border bg-white p-4 row gy-3">
                        <div className="col-12">
                            <div className="mb-2">
                                <label className="form-label fw-bold">{translate("title_of_ad")}</label>
                                <Input type="text" name="title" value={undefined} onChange={(v: string) => { setTitle(v) }} placeholder={"" + translate("your_title")} />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="mb-2">
                                <label className="form-label fw-bold">{translate("job_of_ad")}</label>
                                <TextInputTags suggestions={jobs.map((job: any) => job.name)} value={undefined} onTags={(v: number[]) => { setJobsSelection(v) }} placeholder={translate(jobs[0].name) + ", " + translate(jobs[1].name) + ", ..."} not_found_message={"" + translate("job_not_found")} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">{translate("country")}</label>
                            <SearchableSelectBox selected={undefined} select={(index: number) => { choiceCountry(getCountries[index].cca2) }} not_found_message={translate("country_not_found")} elements={countries}>{translate("select_a_country")}</SearchableSelectBox>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold" >{translate("city")}</label>
                            <SearchableSelectBox selected={undefined} select={(index: number) => { setCity(cities[index].toponymName) }} not_found_message={translate("city_not_found")} elements={cities.map((country: any) => country.toponymName)}>{translate("select_a_city")}</SearchableSelectBox>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">{translate("start_date")}</label>
                            <DateInput onChange={(date: Date) => setBegin(date)} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">{translate("end_date")}</label>
                            <DateInput onChange={(date: Date) => setEnd(date)} />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold">{translate("description")}</label>
                            <EditorWithNoSSR data={""} onChange={(v: any) => { setDescription(v) }} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs());
    const user = await ServerSide.getUser(context);
    const datas = await ServerSide.getServerSideProps(context, "create_a_advertisement", user);

    if (user == null)
        return {
            redirect: {
                destination: "/" + datas.lang + "/signin",
                permenant: false
            }
        }
        
    if (user.profile.role !== RoleType.RECRUITER)
        return {
            redirect: {
                destination: "/" + datas.lang + "/listings",
                permenant: false
            }
        }

    return {
        props: {
            ...datas,
            jobs
        }
    };
}