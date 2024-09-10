import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import Input from '@/components/Input';
import JobsAPI from '@/api/JobsAPI';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import DropdownComponent from '@/components/DropdownComponent';
import CheckBox from '@/components/CheckBox';
import config from "@/config.json"
import { buildMediaURL } from '@/utils/client.utils';
import eyes from "@/assets/eyes.json"
import ethnics from "@/assets/ethnics.json"
import hairs from "@/assets/hairs.json"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientSide } from '@/sides/client/ClientSide';
import ButtonsSelector from '@/components/ButtonsSelector';
import styles from "@/assets/styles.json";
import getCountries from '@/assets/countries.json';
import { getArtists } from '@/api/ProfileAPI';
import { CountriesHandler } from '@/handler/CountriesHandler';
import { fetchCitiesData } from '@/api/CitiesAPI';
import ScreenUtils from '@/utils/screen.utils';
import { buildProfileRoute } from '@/handler/router';
import Footer from '@/components/Footer';
import { getSession } from '@/handler/session';
import Image from 'next/image';

export default function Search(
    props: {
        host: string,
        title: string,
        lang: string,
        jobs: string[],
        user?: any,
        job: string
    }) {


    const lang = props.lang;
    const host = props.host;
    const jobs_ = props.jobs.filter((job) => (job != "voice_over" && job != "extra_stuntman"));
    const user = ClientSide.parseUser(props.user);

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const jobsCommons = jobs_.map((job) => translate(job));

    const [profiles, setProfiles] = useState<any[]>([])
    const [totalPage, setTotalPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const fetchArtists = async (filters?: any) => {
        const { profiles: artists, limit, pages } = await getArtists(page, filters, getSession());
        setTotalPage(pages);
        setProfiles(artists);
    }

    const canSeeMore = () => {
        return page < totalPage
    }

    const seeMore = async () => {
        if (!canSeeMore()) return;
        setPage((page: number) => page + 1)
        const { profiles: artists, limit, pages } = await getArtists(page + 1, getFilters(), getSession());
        setTotalPage(pages);
        setProfiles((profiles) => [...profiles, ...artists]);
    }

    const countries = getCountries.map((country) => translate(country.common));
    const [cities, setCities] = useState<any[]>([]);

    const [name, setName] = useState<string>("")

    const [job, setJob] = useState<string>(props.job ?? "");
    const [country, setCountry] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [genderFilter, setGenderFilter] = useState<number[]>([]);
    const [ethnicFilter, setEthnicFilter] = useState<number[]>([]);
    const [eyesFilter, setEyesFilter] = useState<number[]>([]);
    const [hairFilter, setHairFilter] = useState<number[]>([]);

    const choiceCountry = async (country: string) => {
        setCountry(country)
        setCities((await fetchCitiesData(country)))
    }

    const [photographerStylesFilter, setPhotographerStylesFilter] = useState<number[]>([]);
    const [videoMakerStylesFilter, setVideoMakerStylesFilter] = useState<number[]>([]);

    const [inAgency, setInAgency] = useState<any>(undefined);
    const [age, setAge] = useState<any>({ min: undefined, max: undefined });

    const [height, setHeight] = useState<any>({ min: undefined, max: undefined });
    const [weight, setWeight] = useState<any>({ min: undefined, max: undefined });
    const [waist, setWaist] = useState<any>({ min: undefined, max: undefined });
    const [hip, setHip] = useState<any>({ min: undefined, max: undefined });
    const [shoe, setShoe] = useState<any>({ min: undefined, max: undefined });
    const [bust, setBust] = useState<any>({ min: undefined, max: undefined });

    const [voiceOver, setVoiceOver] = useState<boolean | undefined>(false);
    const [extraStruntman, setExtraStuntman] = useState<boolean | undefined>(false);
    const [tattoo, setTattoo] = useState<boolean | undefined>(undefined);
    const [bodyModification, setBodyModification] = useState<boolean | undefined>(undefined);

    const jobs = () => {
        const jobs: any = [];
        if (!extraStruntman && !voiceOver && job.length > 0) {
            jobs.push(job);
        }
        if (extraStruntman) {
            jobs.push("extra_stuntman");
        }
        if (voiceOver) {
            jobs.push("voice_over")
        }

        return jobs;
    }

    const getFilters = () => {
        return {
            name,
            gender: genderFilter,
            in_agency: inAgency,
            country,
            city,
            age,
            jobs: jobs(),
            photographer_styles: photographerStylesFilter.map((index) => styles.photographerStyles[index]),
            videomaker_styles: videoMakerStylesFilter.map((index) => styles.videoMakerStyles[index]),
            body: {
                ethnic: ethnicFilter,
                hair: hairFilter,
                eyes: eyesFilter,
                height,
                weight,
                waist,
                hip,
                shoe,
                bust,
                tattoo,
                body_modification: bodyModification
            }
        }
    }

    const [loading, setLoading] = useState<boolean>(false);

    const updateArtists = async () => {
        setLoading(true)
        await fetchArtists(getFilters());
        setLoading(false)
    }

    useEffect(() => {
        if (name == "") {
            updateArtists();
            return;
        }
        
        const timeoutId = setTimeout(() => {
            updateArtists();
        }, 700);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [name]);

    useEffect(() => {
        setPage(1);
        updateArtists();
    }, [genderFilter,
        ethnicFilter,
        inAgency,
        eyesFilter,
        hairFilter,
        country,
        job,
        height,
        weight,
        waist,
        hip,
        shoe,
        city,
        bust,
        tattoo,
        bodyModification,
        videoMakerStylesFilter,
        age,
        photographerStylesFilter,
        extraStruntman,
        voiceOver
    ])

    const [showFilters, setShowFilters] = useState<boolean | undefined>(undefined);
    const [showDefaultFilter, setShowDefaultFilters] = useState(true);

    useEffect(() => {
        if (ScreenUtils.getInnerWidth() <= ScreenUtils.LG) {
            setShowDefaultFilters(false)
        }
    }, [])

    const isShowed = () => {
        const isShowed = (showFilters == undefined ? showDefaultFilter : showFilters);
        return isShowed;
    }

    const filtersComponent = () => {

        return (
            <div className="clickable bg-white border p-4 text-black">
                <div className="p-3 py-0 d-flex" onClick={(e) => setShowFilters(!isShowed())} tabIndex={1}>
                    <h2 className="fs-4">{translate("filters")}</h2>
                    <button className={"ms-auto arrow-btn " + (isShowed() ? "showed" : "")}><i className="fa-solid fa-chevron-down"></i></button>
                </div>
                <hr />
                <div className={(!isShowed()) ? "d-none" : "d-block"}>
                    <div className="d-flex flex-column gap-4">
                        <DropdownComponent show={true} title={translate("gender")}>
                            {
                                config.genders.map((gender, index) => {
                                    return (
                                        <CheckBox checked={genderFilter.includes(index)} onChange={(v: boolean) => { setGenderFilter((genderFilter) => v ? [...genderFilter, index] : genderFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(gender)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                        {
                            job == "appearing" && (
                                <DropdownComponent show={true} title={translate("appearing")}>
                                    <CheckBox checked={voiceOver} onChange={(v: boolean) => { setVoiceOver(v) }} >
                                        {translate("voice_over")}
                                    </CheckBox>
                                    <CheckBox checked={extraStruntman} onChange={(v: boolean) => { setExtraStuntman(v) }} >
                                        {translate("extra_stuntman")}
                                    </CheckBox>
                                </DropdownComponent>
                            )
                        }
                        <DropdownComponent show={true} title={translate("others")}>
                            <CheckBox checked={inAgency} onChange={(v: boolean) => { setInAgency(v) }} >
                                {translate("in_agency")}
                            </CheckBox>
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("ethnic_group")}>
                            {
                                ethnics.map((ethnic, index) => {
                                    return (
                                        <CheckBox checked={ethnicFilter.includes(index)} onChange={(v: boolean) => { setEthnicFilter((ethnicFilter) => v ? [...ethnicFilter, index] : ethnicFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(ethnic)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("hair")}>
                            {
                                hairs.map((hair, index) => {
                                    return (
                                        <CheckBox checked={hairFilter.includes(index)} onChange={(v: boolean) => { setHairFilter((hairFilter) => v ? [...hairFilter, index] : hairFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(hair)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("eyes")}>
                            {
                                eyes.map((eyes, index) => {
                                    return (
                                        <CheckBox checked={eyesFilter.includes(index)} onChange={(v: boolean) => { setEyesFilter((eyesFilter) => v ? [...eyesFilter, index] : eyesFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(eyes)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("body_physics")}>
                            <label className="form-label text-uppercase fw-semibold mb-0 mt-3">{translate("age")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setAge({ ...age, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setAge({ ...age, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mb-0 mt-3">{translate("height")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setHeight({ ...height, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setHeight({ ...height, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0 mb-0">{translate("weight")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setWeight({ ...weight, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setWeight({ ...weight, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("bust")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setBust({ ...bust, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setBust({ ...bust, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("hip")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setHip({ ...hip, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setHip({ ...hip, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("waist")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setWaist({ ...waist, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setWaist({ ...waist, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("shoe")}</label>
                            <div className="d-flex gap-2">
                                <Input onChange={(v: number) => { setShoe({ ...shoe, min: v }) }} type="number" placeholder="MIN" />
                                <Input onChange={(v: number) => { setShoe({ ...shoe, max: v }) }} type="number" placeholder="MAX" />
                            </div>
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("body_modification")}</label>
                            <ButtonsSelector canUnset={true} value={bodyModification} selected={(index: number) => { setBodyModification(index == 1) }} selection={[translate("no"), translate("yes")]} />
                            <label className="form-label text-uppercase fw-semibold mt-3 mb-0">{translate("tattoo")}</label>
                            <ButtonsSelector canUnset={true} value={tattoo} selected={(index: number) => { setTattoo(index == 1) }} selection={[translate("no"), translate("yes")]} />
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("style_of_photo")}>
                            {
                                styles.photographerStyles.map((style, index) => {
                                    return (
                                        <CheckBox checked={photographerStylesFilter.includes(index)} onChange={(v: boolean) => { setPhotographerStylesFilter((photographerStylesFilter) => v ? [...photographerStylesFilter, index] : photographerStylesFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(style)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                        <DropdownComponent show={true} title={translate("style_of_video")}>
                            {
                                styles.videoMakerStyles.map((style, index) => {
                                    return (
                                        <CheckBox checked={videoMakerStylesFilter.includes(index)} onChange={(v: boolean) => { setVideoMakerStylesFilter((videoMakerStylesFilter) => v ? [...videoMakerStylesFilter, index] : videoMakerStylesFilter.filter((filter) => filter != index)); }} key={index}>
                                            {translate(style)}
                                        </CheckBox>
                                    )
                                })
                            }
                        </DropdownComponent>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
        <meta name="description" content={translate("search_page_description")+""} />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
                <div className="border-bottom">
                    <div className="container pb-3">
                        <div className="pt-1 row mx-0 bg-white gy-2 gx-2">
                            <div className="col-6 col-lg-3">
                                <Input name="text" value={name} onChange={(v: string) => { setName(v) }} type="text" placeholder={"" + translate("name")} />
                            </div>
                            <div className="col-6 col-lg-3">
                                <SearchableSelectBox selected={job != "" ? jobs_.indexOf(job) : undefined} select={(index: number) => { setJob(jobs_[index]) }} not_found_message={translate("profession_not_found")} elements={jobsCommons}>{translate("job")}</SearchableSelectBox>
                            </div>
                            <div className="col-6 col-lg-3">
                                <SearchableSelectBox selected={undefined} select={(index: number) => { choiceCountry(getCountries[index].cca2) }} not_found_message={translate("country_not_found")} elements={countries}>{translate("country")}</SearchableSelectBox>
                            </div>
                            <div className="col-6 col-lg-3">
                                <SearchableSelectBox selected={undefined} select={(index: number) => { setCity(cities[index].toponymName) }} not_found_message={translate("city_not_found")} elements={cities.map((country: any) => country.toponymName)}>{translate("city")}</SearchableSelectBox>
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>
            <div className="flex-grow-1 bg-light">
                <div className="container">
                    <div className="px-0 py-0 py-md-2">
                        <div className="row m-0 gx-2 gy-3 m-0 pb-3">
                            <div className="col-12 col-lg-4 col-xxl-3">
                                {filtersComponent()}
                            </div>
                            <div className="col-12 col-lg-8 col-xxl-9">
                                <div className="row g-2">
                                    {loading ? (
                                        <div className="spinner-border m-auto" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {
                                                profiles != undefined && profiles.length > 0 ? profiles.map((profile: any, index: number) => {
                                                    return (
                                                        <div key={index} className="col-6 col-md-4">
                                                            <Link href={buildProfileRoute(lang, profile.firstname, profile.lastname, profile.id)} className="text-decoration-none bg-black d-flex flex-column profile h-100">
                                                                <div>
                                                                    <div className="picture position-relative">
                                                                        <Image width={500} height={500} className="bg-white h-100 w-100 object-fit-cover" src={buildMediaURL(profile.picture)} alt="" />
                                                                        <div className="position-absolute bottom-0 start-0 end-0 top-0 text-white p-3 d-flex flex-column justify-content-end" style={{ background: "linear-gradient(360deg, #000000 0%, rgba(32, 22, 22, 0) 41.52%)" }}>
                                                                            <h3 className="fs-5 mb-0 text-initial">{profile.firstname} {profile.lastname}</h3>
                                                                            <span><i className="fa-solid fa-location-dot me-2"></i>{profile.city}, {translate(CountriesHandler.getCountryCommon(profile.country))}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-black py-3 text-center border-white border-top">
                                                                        {profile.main_job != undefined && (
                                                                            <span className="fs-6 fw-semibold w-100 text-uppercase text-white text-center">{translate(profile.main_job)}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Link>

                                                      
                                                        </div>
                                                    )
                                                }) : (
                                                    <span className="pt-5 text-dark fs-3 w-100 text-center">{translate("any_profiles_founds")}</span>
                                                )
                                            }
                                        </>
                                    )}
                                    {canSeeMore() && (
                                        <button onClick={(e) => seeMore()} className="w-100 p-3 btn btn-primary">
                                            {translate("see_more")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);
    const datas = await ServerSide.getServerSideProps(context, "search");

    const { job } = context.query;
    let props: any = {
        ...datas,
        jobs,
    }

    if (job != undefined) {
        props = { ...props, job }
    }

    return { props };
}