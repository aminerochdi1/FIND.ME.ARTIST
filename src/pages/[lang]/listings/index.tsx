import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import JobsAPI from '@/api/JobsAPI';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientSide } from '@/sides/client/ClientSide';
import getCountries from '@/assets/countries.json';
import { CREATE_ADVERTISEMENT, buildRoute } from '@/handler/router';
import { RoleType } from '@/classes/RoleType';
import { fetchCitiesData } from '@/api/CitiesAPI';
import { Ad } from '@/classes/Ad';
import { AdsAPI } from '@/api/AdsAPI';
import { getSession } from '@/handler/session';
import DatePicker from '@/components/DatePicker';
import AdComponent from '@/components/Ad';
import Footer from '@/components/Footer';

export default function Search(
    props: {
        host: string,
        lang: string,
        title: string,
        jobs: string[],
        user?: any,
    }) {

    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const jobs = props.jobs;
    const user = props.user != undefined ? ClientSide.parseUser(props.user) : undefined;

    const isRecruiter = () => {
        return user != undefined && user.profile.role == RoleType.RECRUITER;
    }

    const countries = getCountries.map((country: any) => translate(country.common));
    const [cities, setCities] = useState<any[]>([]);

    /* FILTERS */
    const [begin, setBegin] = useState<string | undefined>(undefined);
    const [job, setJob] = useState<number | undefined>(undefined);
    const [country, setCountry] = useState<number | undefined>(undefined);
    const [city, setCity] = useState<number | undefined>(undefined);

    const choiceCountry = async (selection: number) => {
        setCountry(selection)
        const cca2 = getCountries[selection].cca2;
        setCities((await fetchCitiesData(cca2)))
    }

    const [ads, setAds] = useState<Ad[] | undefined>(undefined);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const fetchAds = async (filters: any) => {
        const { limit, pages, ads } = await AdsAPI.getAll(page, getSession(), filters);
        setTotalPage(pages)
        setAds(ads);
    }

    const getFilters = () => {
        return {
            begin: begin != undefined ? new Date(begin).toISOString() : undefined,
            job: job != undefined ? jobs[job] : "",
            country: country != undefined ? getCountries[country].cca2 : "",
            city: city != undefined ? cities[city].toponymName : "",
        }
    }

    const updateAds = async () => {
        fetchAds(getFilters())
    }

    const canSeeMore = () => {
        return page < totalPage
    }

    const seeMore = async () => {
        if (!canSeeMore()) return;
        setPage((page: number) => page + 1)
        const { ads: ads_, limit, pages } = await AdsAPI.getAll(page, getSession(), getFilters());
        setTotalPage(pages);
        setAds((ads: any) => [...ads, ...ads_]);
    }

    useEffect(() => {
        setPage(1);
        updateAds();
    }, [])

    const Filters = () => {
        return (
            <div className="container">
                <div className="py-2 row m-0 gx-2 gy-2 bg-white m-0 justify-content-end">
                    <div className="col-6 col-md-6 col-lg-3 col-xxl">
                        <DatePicker defaultValue={new Date().toISOString().split("T")[0]} min={new Date().toISOString().split("T")[0]} onChange={(date: string) => setBegin(date)} placeholder={""} />
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 col-xxl">
                        <SearchableSelectBox selected={job} select={(index: number) => { setJob(index) }} not_found_message={translate("profession_not_found")} elements={jobs.map((job) => translate(job))}>{translate("job")}</SearchableSelectBox>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 col-xxl">
                        <SearchableSelectBox selected={country} select={(index: number) => { choiceCountry(index) }} not_found_message={translate("country_not_found")} elements={countries}>{translate("country")}</SearchableSelectBox>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 col-xxl">
                        <SearchableSelectBox selected={city} select={(index: number) => { setCity(index) }} not_found_message={translate("city_not_found")} elements={cities.map((city: any) => city.toponymName)}>{translate("city")}</SearchableSelectBox>
                    </div>
                    <div className="col-auto">
                        <button onClick={(e) => updateAds()} className="btn btn-black h-100 p-0 d-flex justify-content-center align-items-center p-2">
                            <i className="fa-solid fa-magnifying-glass fs-2"></i>
                        </button>
                    </div>
                    {
                        isRecruiter() && (
                            <div className="col col-lg-auto">

                                <Link href={buildRoute(lang, CREATE_ADVERTISEMENT)} className="btn btn-black h-100 px-3 w-100 d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-add fs-2 me-2"></i>
                                    {translate("post_a_advertise")}
                                </div>
                                </Link>

                                {/* <Link href={buildRoute(lang, CREATE_ADVERTISEMENT)} className="btn btn-black h-100 px-3 w-100 d-flex align-items-center">
                                    <i className="fa-solid fa-add fs-2 me-2"></i>
                                    {translate("post_a_advertise")}
                                </Link> */}
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={translate("announces_page_description") + ""} />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
                {Filters()}
            </Navbar>
            <div className="bg-light flex-grow-1 px-md-5 ">
                <div className="container">
                    <div className="row m-0 gx-2 gy-3 m-0 pb-3">
                        {
                            ads == undefined && (
                                <span className="pt-5 text-dark fs-3 w-100 text-center">{translate("loading")}</span>
                            )
                        }
                        {
                            (ads != undefined && ads.length > 0) && ads.map((ad, index) => {

                                return (
                                    <AdComponent key={index} ad={ad} lang={lang} />
                                )
                            })
                        }

                        {
                            (ads != undefined && ads.length > 0) && canSeeMore() && (
                                <button onClick={(e) => seeMore()} className="w-100 p-3 btn btn-primary">
                                    {translate("see_more")}
                                </button>
                            )
                        }
                        {
                            (ads != undefined && ads.length == 0) && (
                                <span className="pt-5 text-dark fs-3 w-100 text-center">{translate("any_ads_founds")}</span>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);
    const datas = await ServerSide.getServerSideProps(context, "ads");

    if (datas.user == null)
        return {
            redirect: {
                destination: "/" + datas.lang + "/signin",
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

