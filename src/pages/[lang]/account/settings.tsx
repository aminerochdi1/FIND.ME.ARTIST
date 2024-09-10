import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { fetchUser, getSession } from '@/handler/session';
import config from "../../../config.json";
import Input from '@/components/Input';
import ButtonsSelector from '@/components/ButtonsSelector';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import { useEffect, useRef, useState } from 'react';
import AvatarUpload from '@/components/AvatarUpload';
import InputRange from '@/components/InputRange';
import TextInputTags from '@/components/TextInputTags';
import languages from "@/assets/languages.json"
import getCountries from "@/assets/countries.json"
import axios from 'axios';
import checkerUtils from '@/utils/checker.utils';
import eyesList from "@/assets/eyes.json"
import ethnicsList from "@/assets/ethnics.json"
import hairsList from "@/assets/hairs.json"
import { buildMediaThumbnailURL, buildMediaURL } from '@/utils/client.utils';
import stylesList from "@/assets/styles.json";
import Link from 'next/link';
import { ServerSide } from '@/sides/server/ServerSide';
import { RoleType } from '@/classes/RoleType';
import { ClientSide } from '@/sides/client/ClientSide';
import { MediaType } from '@/classes/MediaType';
import { LISTINGS, SEARCH, buildRoute } from '@/handler/router';
import Footer from '@/components/Footer';
import CardForm from "@/components/CardForm.js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { DiscountAPI } from '@/api/DiscountAPI';
import { SubscriptionAPI } from '@/api/SubscriptionAPI';
import AvatarImage from "../../../components/AvatarImage";

export default function Settings(props: { lang: string, jobs: any[], user: string, host: string, title: string }) {

    const host = props.host;

    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const onError = (v: string) => {
        setError(v);
    }

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;
    const [step, setStep] = useState<number>(0)
    const [user, setUser] = useState<any>(ClientSide.parseUser(props.user));

    const jobsList = props.jobs;
    const [showComponent, setShowComponent] = useState<any>(undefined);

    let languagesList: string[] = [];

    languages.map((language: any, index: number) => {
        languagesList = [...languagesList, translate(language)];
    })

    const countries = getCountries.map((country: any) => translate(country.common));

    const genders: string[] = config.genders.map((gender) => translate(gender));
    const hairs: string[] = hairsList.map((hair) => (translate(hair)));
    const eyes: string[] = eyesList.map((eye) => (translate(eye)));
    const ethnics: string[] = ethnicsList.map((ethnic) => (translate(ethnic)));

    const photographe_styles: string[] = stylesList.photographerStyles.map((style) => (translate(style)));
    const videomaker_styles: string[] = stylesList.videoMakerStyles.map((style) => (translate(style)));

    const { ARTIST } = RoleType;

    const toStep = async (step: number) => {
        setUser(await fetchUser());
        setStep(step)

        // reset
        setShowComponent(undefined)
        setError(undefined)
        setSuccess(undefined);
    }

    const Header = (props: { onNext: any, canNext: boolean }) => {

        const canNext = /*props.canNext*/ true;

        const onNext = async () => {
            if (!canNext) return;
            if (props.onNext != undefined)
                await props.onNext()
            next();
        }

        return (
            <>
                <h3 className="d-block d-md-none pb-3 text-center mx-auto">{steps[step].title}</h3>
                <div className="position-relative mb-5 mb-md-4">
                    {step != 0 && (
                        <div className="position-absolute h-100 d-flex">
                            <a href="#" onClick={(e) => back()} className="text-clickable text-black my-auto">
                                <i className="fa-solid fa-chevron-left me-2"></i>
                                {translate("back")}
                            </a>
                        </div>
                    )}
                    <div className="position-absolute h-100 d-flex end-0">
                        <a href="#" onClick={(e) => { onNext() }} className={"text-clickable my-auto " + (canNext ? "text-black" : "text-danger")}>
                            {step == steps.length - 1 ? translate("finish") : translate("next")}
                            <i className="fa-solid fa-chevron-right ms-2"></i>
                        </a>
                    </div>
                    <h3 className="d-none d-md-block text-center mb-4 mb-auto mx-auto">{steps[step].title}</h3>
                </div>
            </>
        )
    }


    const updateUser = async () => {
        const user = await fetchUser();
        setUser(user);
    }

    const SettingsFooter = (props: { onSave?: any, canSave: boolean }) => {

        const update = async () => {
            const user = await fetchUser();
            setUser(user);
        }

        const onSave = async () => {
            try {
                setSuccess(undefined)
                await props.onSave();
                update();
                setSuccess("save_success");
            } catch (e) {
                console.error(e);
                onError("error_on_save")
            }
        }

        return (
            <div className="d-grid d-md-flex gap-2 py-4 py-md-5">
                
                {error != undefined && (
                    <span className="fw-semibold" style={{ color: "var(--bs-red)" }}>{translate(error)}</span>
                )}
                {success != undefined && (
                    <span className="fw-semibold" style={{ color: "var(--bs-green)" }}>{translate(success)}</span>
                )}
               
                {
                    error != undefined && (
                        <div className="mx-auto mt-3"><span className="px-2 py-1 bg-danger text-black">{translate(error)}</span></div>
                    )
                }
                {
                    (success != undefined) && (
                        <div className="mx-auto mt-3"><span className="px-2 py-1 bg-success text-black">{translate(success)}</span></div>
                    )
                }
                {props.onSave != undefined && (
                    <button disabled={!props.canSave} onClick={(e) => onSave()} className="mx-auto ms-auto btn btn-primary fw-semibold">{translate("save_modifications")}</button>
                )}
            </div>
        )
    }

    const Finish = () => {
        return (
            <div className="pt-5 pb-2 d-flex flex-column">
                <h5 className="px-5 text-center">{translate("account_configuration_finish")}</h5>
                {user.profile.role == RoleType.ARTIST && (
                    <Link href={buildRoute(props.lang, LISTINGS)} className="mx-auto mt-5 btn btn-black"><i className="fa-solid fa-house me-2"></i>{translate("go_to_ads")}</Link>
                )
                }
                {user.profile.role == RoleType.RECRUITER && (
                    <Link href={buildRoute(props.lang, SEARCH)} className="mx-auto mt-5 btn btn-black"><i className="fa-solid fa-house me-2"></i>{translate("go_to_artists")}</Link>
                )
                }
            </div>
        )
    }

    const back = () => {
        toStep(step - 1);
    }

    const next = () => {
        steps[step].update();
        if (step + 1 < steps.length) {
            toStep(step + 1);
        }
    }

    const [firstname, setFirstname] = useState(user.profile.firstname);
    const [lastname, setLastname] = useState(user.profile.lastname);

    const [gender, setGender] = useState(user.profile.gender);
    const [phone, setPhone] = useState(user.profile.phone == null ? "" : user.profile.phone);
    const [agency1, setAgency1] = useState(user.profile.agency1 ?? "");
    const [agency2, setAgency2] = useState(user.profile.agency2 ?? "");
    const [agency1Link, setAgency1Link] = useState(user.profile.agency_1_link ?? "");
    const [agency2Link, setAgency2Link] = useState(user.profile.agency_2_link ?? "");
    const [inAgency, setInAgency] = useState<boolean>(user.profile.in_agency ?? false);

    const PersonalInformations = () => {

        const [jobs, setJobs] = useState<number[]>(user.profile.jobs ? user.profile.jobs.map((job: any) => jobsList.findIndex((job_) => job.id == job_.id)) : []);

        const [canNext, setCanNext] = useState(true);

        const [jobsDisabled, setJobsDisabled] = useState<string[]>([]);

        useEffect(() => {
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

            setCanNext(
                checkerUtils.FIRSTNAME.test(firstname) &&
                    checkerUtils.LASTNAME.test(lastname) &&
                    (gender == 1 || gender == 0) &&
                    (phone.length == 0 || phone.length == 14) &&
                    user.profile.role == ARTIST ? jobs.length > 0 : true &&
                    (inAgency ? agency1 != null && (agency1.length > 0 || agency1Link.length > 0 ? (agency1.length > 0 && agency1Link.length > 0) ? checkerUtils.URL.test(agency1Link) : false : true) : true) &&
                (inAgency ? agency2 != null && (agency2.length > 0 || agency2Link.length > 0 ? (agency2.length > 0 && agency2Link.length > 0) ? checkerUtils.URL.test(agency2Link) : false : true) : true)
            );
        }, [firstname, lastname, gender, phone, agency1, agency1Link, agency2Link, agency2, jobs, inAgency]);

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/profile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        firstname,
                        lastname,
                        phone,
                        gender,
                        in_agency: inAgency,
                        agency1: inAgency ? agency1 : "",
                        agency2: inAgency ? agency2 : "",
                        agency1Link: inAgency ? agency1Link : "",
                        agency2Link: inAgency ? agency2Link : "",
                        jobs: jobs.map((i) => jobsList[i].id)
                    }
                )
            });
            const responseData = await response.json();
        }

        const saveImage = async (image: any) => {
            if (image !== null) {
                const formData = new FormData();
                formData.append('image', image);

                const result = await axios.post(config.API + '/user/upload/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": "Bearer " + getSession()
                    }
                });
                updateUser();
            }
        }

        return (
            <>
                <Header onNext={undefined} canNext={canNext} />
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="mx-auto my-3">
                            <AvatarUpload onError={onError} onImage={(image: any) => {
                                saveImage(image)
                            }}
                                src={user.profile.picture != null ? buildMediaURL(user.profile.picture) : undefined} placeholder={translate("add_profile_picture") + ""} />
                        </div>
                    </div>
                    <div className="col-md-10 col-12">
                        <div className="row m-0 g-2 h-100">
                            <div className="col-12 mt-0">
                                <label className="form-label fw-semibold">{translate("link_of_profil")}</label>
                                <Input disabled={true} type="text" onChange={(v: string) => { }} dynamicValue={config.website + props.lang + "/profile/" + firstname + "-" + lastname + "-" + user.profile.id} placeholder={""} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">{translate("firstname")}*</label>
                                <Input required={true} emptyMessage={translate("input_empty")} type="firstname" onChange={(v: string) => { setFirstname(v) }} value={firstname} placeholder={translate("your_firstname")} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">{translate("lastname")}*</label>
                                <Input required={true} emptyMessage={translate("input_empty")} type="lastname" onChange={(v: string) => { setLastname(v) }} value={lastname} placeholder={translate("your_lastname")} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">{translate("number_of_phone")}</label>
                                <Input type="tel" incomplete={translate("phone_incomplete")} onChange={(v: string) => { setPhone(v) }} maxLength={10} value={phone} placeholder={translate("your_phone_number")} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">{translate("gender")}</label>
                                <ButtonsSelector value={gender} selected={(index: number) => { setGender(index) }} selection={genders} />
                            </div>
                            {
                                <>
                                    {
                                        user.profile.role == ARTIST
                                        && (<>
                                            <div className="mb-2">
                                                <label className="form-label fw-semibold">{translate("professions")}</label>
                                                <TextInputTags not_found_message={translate("job_not_found")} ignores={jobsDisabled} value={jobs} onTags={(jobs: number[]) => { setJobs(jobs) }} suggestions={jobsList.map((job) => job.name)} placeholder={"" + translate("your_job")} />
                                            </div>
                                        </>
                                        )
                                    }
                                    <div className="col-12 mt-3">
                                        <label htmlFor="" className="form-label fw-semibold">{translate("you_are_in_" + (user.profile.role == ARTIST ? "agency" : "company"))}</label>
                                        <ButtonsSelector value={inAgency ? 0 : 1} selected={(index: number) => { setInAgency(index == 0) }} selection={[translate("yes"), translate("no")]} />
                                    </div>
                                    {
                                        inAgency && (
                                            <>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-semibold">{translate((user.profile.role == ARTIST ? "agency" : "company"))} 1</label>
                                                    <Input type="text" onChange={(v: string) => { setAgency1(v) }} value={agency1} placeholder={translate("your_main_" + (user.profile.role == ARTIST ? "agency" : "company"))} />
                                                    <label className="mt-3 form-label fw-semibold">{translate("your_link")}</label>
                                                    <Input type="text" onChange={(v: string) => { setAgency1Link(v) }} value={agency1Link} placeholder="https://www.site.fr" />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-semibold">{translate((user.profile.role == ARTIST ? "agency" : "company"))} 2</label>
                                                    <Input type="text" onChange={(v: string) => { setAgency2(v) }} value={agency2} placeholder={translate("your_secondary_" + (user.profile.role == ARTIST ? "agency" : "company"))} />
                                                    <label className="mt-3 form-label fw-semibold">{translate("your_link")}</label>
                                                    <Input type="text" onChange={(v: string) => { setAgency2Link(v) }} value={agency2Link} placeholder="https://www.site.fr" />
                                                </div>
                                                <div className="col-auto">
                                                    <div className="bg-secondary fw-semibold opacity-25 text-white px-2 py-1 small">{translate((user.profile.role == ARTIST ? "agency" : "company") + "_information_not_needed")}</div>
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const MEDIA_POLAS = "polas";
    const MEDIA_PHOTOS = "photos";
    const MEDIA_VIDEOS = "videos";

    const ShowMedias = (props: { type: string }) => {

        const type = props.type;
        const [content, setContent] = useState<any>(user.profile[type]);

        if (content.length == 0) {
            return (
                <div className="my-5 w-100 d-flex justify-content-center">
                    <span className="text-dark fs-5">{translate("no_items_listed")}</span>
                </div>
            )
        }

        const deleteMedia = async (reference_id: number) => {
            const response = await fetch(config.API + "/user/delete/" + type, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        id: reference_id
                    }
                )
            });
            const responseData = await response.json();
            if (response.status == 201) {
                setUser(await fetchUser())
                setContent((content: any) => content.filter((media: any) => media.reference_id != reference_id))
            } else {
                // ERROR 
            }
        }

        return (
            <>
                <div className="row m-0 g-2">
                    {
                        content.map((media: any, index: number) => {
                            if (type == "videos") {
                                const isYoutubeLink = checkerUtils.YOUTUBE_VIDEO_URL.test(media.path);
                                const match = isYoutubeLink ? media.path.match(checkerUtils.YOUTUBE_VIDEO_URL) : media.path.match(checkerUtils.VIMEO_VIDEO_URL);
                                return (
                                    <div key={index} className="col-12 col-xl-6">
                                        <div className="video-container bg-light" key={index}>
                                            <div className="position-absolute top-0 start-0 end-0 bottom-0 justify-content-center align-items-center d-flex flex-column gap-2 ">
                                                <i className="fa-brands fa-youtube fs-1" style={{ color: "#FF0000" }}>

                                                </i>
                                                <div className="spinner-border" style={{ color: "#FF0000" }} role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                            <div className="position-absolute top-0 start-0 end-0 bottom-0">
                                                {
                                                    isYoutubeLink ? (
                                                        <iframe className="w-100 h-100" src={"https://www.youtube.com/embed/" + match[1]} frameBorder={0} allowFullScreen={true}></iframe>
                                                    ) : (
                                                        <iframe className="w-100 h-100" src={"https://player.vimeo.com/video/" + match[1]} frameBorder={0} allowFullScreen={true}></iframe>
                                                    )
                                                }
                                            </div>
                                            <div className="position-absolute top-0 end-0 p-1">
                                                <button onClick={(e) => deleteMedia(media.reference_id)} className="btn btn-delete">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="col-4" key={index}>
                                        <div className="text-white position-relative">
                                            <Image width={500} height={500} className="object-fit-cover h-100 w-100" src={buildMediaThumbnailURL(media.path, 500, 500)} alt="" />
                                            <div className="position-absolute top-0 end-0 p-1">
                                                <button onClick={(e) => deleteMedia(media.reference_id)} className="btn btn-delete">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </>
        )
    }

    const AddVideoLink = () => {
        const [link, setLink] = useState<string>("");
        const [submitting, setSubmitting] = useState<boolean>(false);
        const [success, setSuccess] = useState<boolean | undefined>(undefined);

        const save = async () => {
            setSubmitting(true);
            const response = await fetch(config.API + "/user/upload/videos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        link
                    }
                )
            });
            if (response.status == 201) {
                setSubmitting(false);
                setSuccess(true);
                setLink("");
                setUser(await fetchUser())
            } else {
                setSuccess(false);
            }
        }

        return (
            <div className="w-100 py-5">
                <div className="d-flex flex-column w-100 align-items-center py-3 gap-5">
                    <div className="col-12 col-md-8 gap-4">
                        <label className="form-check-label fw-semibold mb-1" >{translate("link_of_video")}</label>
                        <Input type="text" dynamicValue={link} onChange={(v: string) => { setLink(v) }} placeholder={"https://www.youtube.com/watch?v="} />
                        {
                            success && (
                                <div className="mt-3"><span className="px-2 py-1 bg-success text-black">{translate("video_added_with_success")}</span></div>
                            )
                        }
                        {
                            (success != undefined && !success) && (
                                <div className="mt-3"><span className="px-2 py-1 bg-danger text-black">{translate("video_added_failed")}</span></div>
                            )
                        }
                    </div>
                    <div className="d-flex gap-2 fs-1">
                        <span className="fa-brands fa-youtube text-red"></span>
                        <span className="fa-brands fa-vimeo" style={{ color: "#5bd1f2" }}></span>
                    </div>
                    <button disabled={submitting || (!checkerUtils.YOUTUBE_VIDEO_URL.test(link) && !checkerUtils.VIMEO_VIDEO_URL.test(link))} onClick={(e) => save()} className="btn btn-black">{translate("save_video")}</button>
                </div>
            </div>
        )
    }

    const MediaContents = () => {

        const converts: any = {
            polas: "polas",
            photo: "photos",
            video: "videos"
        }

        const contents: any = {
            polas: <ShowMedias type={MEDIA_POLAS} />,
            photo: <ShowMedias type={MEDIA_PHOTOS} />,
            video: <ShowMedias type={MEDIA_VIDEOS} />,
        }

        const [waiting, setWaiting] = useState<any>({ polas: false, photos: false, videos: false });

        const changeWaiting = (waiting: any, target: string, value: boolean) => {
            return {
                ...waiting,
                [target]: value
            };
        }

        const hasWaiting = () => {
            return Object.values(converts).filter((target: any) => waiting[target]).length > 0;
        }

        const send = async (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
            setWaiting((waiting: any) => changeWaiting(waiting, target, true))
            const images: any = e.target.files;

            if (images !== null) {
                setError(undefined)
                const formData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    if (images[i].size / 1024 > 15360)
                        return onError("max_size_file")
                    formData.append('images', images[i]);
                }

                try {
                    const result = await axios.post(config.API + '/user/upload/' + target, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            "Authorization": "Bearer " + getSession()
                        }
                    });
                    if (result.status == 201) {
                        setUser(await fetchUser())
                    } else {
                        // FAILED
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            setWaiting((waiting: any) => changeWaiting(waiting, target, false))
        }

        const showPolas = (user.profile.jobs.filter((job: any) => (job.name == "model" || job.name == "actor" || job.name == "appearing" || job.name == "dancer" || job.name == "influencer")).length > 0);
        const showPhotos = true;
        const showVideos = true;

        const shows: any = {
            polas: showPolas,
            photo: showPhotos,
            video: showVideos,
        }

        const MediaBox = (media: string) => {
            const show = shows[media];
            if (!show) return;
            const type = converts[media];
            const content = contents[media];
            const count = user.profile[type].length;

            return (
                <div className="col-12 col-md-4">
                    <div className="bg-light border p-4 text-black">
                        <div className="text-center">
                            <h3 className="mb-0 fs-2">{translate(type + "_title")}</h3>
                            <button disabled={waiting[type]} className="border-0 bg-transparent text-dark text-clickable"
                                onClick={(e) => setShowComponent({ title: translate(type + ""), content })} >{translate("show_all_" + type)}</button>
                        </div>
                        <div className="py-5 text-center">
                            {!waiting[type] ? (
                                <span className="fs-4 fw-semibold text-dark">{translate(type + "_count").replace("{count}", count + "")}</span>
                            ) : (
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                        </div>
                        <button onClick={(e) => { if (type == "videos") setShowComponent({ title: translate("add_a_video"), content: <AddVideoLink /> }) }} disabled={waiting[type]} className="btn btn-black w-100 position-relative">
                            <i className="fa-solid fa-image me-2"></i>
                            {translate("add_" + type)}
                            {(type != "videos") && (
                                <input accept=".png,.jpeg,.jpg" onChange={(e) => send(e, type)} multiple className="opacity-0 position-absolute top-0 start-0 end-0 bottom-0 bg-primary" size={2048} type="file" name="" id="" />
                            )}
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <>
                <Header onNext={() => { }} canNext={!hasWaiting()} />
                <div className="row m-0 g-2 justify-content-center">
                    {Object.values(MediaType).map((media) => {
                        return MediaBox(media);
                    })}
                </div>
                <SettingsFooter onSave={undefined} canSave={true} />
            </>
        )
    }

    const Physics = () => {

        const body = user.profile.body;

        const [ethnicChoiced, setEthnic] = useState<number | undefined>(body != null ? body.ethnic : undefined);
        const [hairChoiced, setHair] = useState<number | undefined>(body != null ? body.hair : undefined);
        const [eyesChoiced, setEyes] = useState<number | undefined>(body != null ? body.eyes : undefined);

        const [height, setHeight] = useState<number | undefined>(body != null ? body.height : undefined);
        const [bust, setBust] = useState<number | undefined>(body != null ? body.bust : undefined);
        const [hip, setHip] = useState<number | undefined>(body != null ? body.hip : undefined);

        const [weight, setWeight] = useState<number | undefined>(body != null ? body.weight : undefined);
        const [waist, setWaist] = useState<number | undefined>(body != null ? body.waist : undefined);
        const [shoe, setShoe] = useState<number | undefined>(body != null ? body.shoe : undefined);

        const [tattoo, setTattoo] = useState<boolean | undefined>(body != null ? body.tattoo : undefined);
        const [body_modification, setBodyModification] = useState<boolean | undefined>(body != null ? body.body_modification : undefined);

        useEffect(() => {
            setCanNext(
                ethnicChoiced != undefined &&
                hairChoiced != undefined &&
                eyesChoiced != undefined &&
                tattoo != undefined &&
                body_modification != undefined
            )
        }, [ethnicChoiced, hairChoiced, eyesChoiced, tattoo, body_modification])

        const [canNext, setCanNext] = useState(false);

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/body", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        ethnic: ethnicChoiced, hair: hairChoiced, eyes: eyesChoiced, height, bust, hip, weight, waist, shoe, tattoo, body_modification
                    }
                )
            });
        }

        return (
            <>
                <Header onNext={undefined} canNext={true} />
                <div className="row gy-3">
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("ethnic_group")}</label>
                        <SearchableSelectBox required={true} emptyMessage={translate("input_is_empty")} selected={ethnicChoiced} select={(index: number) => { setEthnic(index) }} not_found_message={translate("ethnic_group_not_found")} elements={ethnics}>{translate("choice_ethnic_group")}</SearchableSelectBox>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("hair")}</label>
                        <SearchableSelectBox required={true} emptyMessage={translate("input_is_empty")} selected={hairChoiced} select={(index: number) => { setHair(index) }} not_found_message={translate("hair_not_found")} elements={hairs}>{translate("choice_hair")}</SearchableSelectBox>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("eyes")}</label>
                        <SearchableSelectBox required={true} emptyMessage={translate("input_is_empty")} selected={eyesChoiced} select={(index: number) => { setEyes(index) }} not_found_message={translate("eyes_not_found")} elements={eyes}>{translate("choice_eyes")}</SearchableSelectBox>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("height")}</label>
                        <InputRange value={height} onChange={(value: number) => { setHeight(value) }} min={checkerUtils.POLICY_BODY.height.min} max={checkerUtils.POLICY_BODY.height.max} extension="cm" />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("bust")}</label>
                        <InputRange value={bust} onChange={(value: number) => { setBust(value) }} min={checkerUtils.POLICY_BODY.bust.min} max={checkerUtils.POLICY_BODY.bust.max} extension="cm" />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("hip")}</label>
                        <InputRange value={hip} onChange={(value: number) => { setHip(value) }} min={checkerUtils.POLICY_BODY.hip.min} max={checkerUtils.POLICY_BODY.hip.max} extension="cm" />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("weight")}</label>
                        <InputRange value={weight} onChange={(value: number) => { setWeight(value) }} min={checkerUtils.POLICY_BODY.weight.min} max={checkerUtils.POLICY_BODY.weight.max} extension="kg" />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("waist")}</label>
                        <InputRange value={waist} onChange={(value: number) => { setWaist(value) }} min={checkerUtils.POLICY_BODY.waist.min} max={checkerUtils.POLICY_BODY.waist.max} extension="cm" />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("shoe")}</label>
                        <InputRange value={shoe} onChange={(value: number) => { setShoe(value) }} min={checkerUtils.POLICY_BODY.shoe.min} max={checkerUtils.POLICY_BODY.shoe.max} />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("tattoo")}</label>
                        <ButtonsSelector value={tattoo} selected={(index: number) => { setTattoo(index == 1) }} selection={[translate("no"), translate("yes")]} />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">{translate("body_modification")}</label>
                        <ButtonsSelector value={body_modification} selected={(index: number) => { setBodyModification(index == 1) }} selection={[translate("no"), translate("yes")]} />
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const Description = () => {

        const [description, setDescription] = useState<string>(user.profile.description);
        const [showDescription, setShowDescription] = useState(user.profile.description != null);

        const onChange = (e: any) => {
            const value = e.target.value;
            if (checkerUtils.DESCRIPTION.test(value)) {
                setDescription(value);
            }
        }

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/profile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        description
                    }
                )
            });
        }

        return (
            <>
                <Header onNext={undefined} canNext={true} />
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h5 className="text-normal mb-3">{translate("describe_yourself")}</h5>
                    
                    <p className="mb-5 text-center fw-semibold">{translate("describe_example")}</p>
                   
                    {!showDescription && (
                        <button onClick={(e) => setShowDescription(true)} className="btn btn-black fs-4">{translate("add_description")}</button>
                    )}
                    {showDescription && (
                        <textarea style={{ height: 10 + "rem" }} value={description} onChange={onChange} className="form-control col-md-8 small" rows={3}></textarea>
                    )}
                </div>
                <SettingsFooter onSave={onSave} canSave={description.length > 0} />
            </>
        )
    }

    const StyleOfPhoto = () => {

        const styles: any = () => {
            let l: number[] = [];
            for (const style of user.profile.styles_of_photographer) {
                let i = 0;
                for (const name of stylesList.photographerStyles) {
                    if (name == style) {
                        l = [...l, i]
                        break;
                    }
                    i++;
                }
            }
            return l;
        }

        const [canNext, setCanNext] = useState(false)
        const [stylesSelected, setStylesSelected] = useState<number[]>(user.profile.styles_of_photographer.length > 0 ? styles() : []);

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/styles", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        job: "photographer",
                        styles: stylesSelected.map((i) => stylesList.photographerStyles[i])
                    }
                )
            });
        }

        useEffect(() => {
            setCanNext(stylesSelected.length > 0);
        }, [stylesSelected])

        return (
            <>
                <Header onNext={undefined} canNext={canNext} />
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <TextInputTags not_found_message={translate("photo_style_not_found")} value={stylesSelected} onTags={(styles: number[]) => { setStylesSelected(styles) }} suggestions={photographe_styles} placeholder={"" + translate("choice_photo_style")} />
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const StyleOfVideo = () => {

        const styles: any = () => {
            let l: number[] = [];
            for (const style of user.profile.styles_of_videomaker) {
                let i = 0;
                for (const name of stylesList.videoMakerStyles) {
                    if (name == style) {
                        l = [...l, i]
                        break;
                    }
                    i++;
                }
            }
            return l;
        }

        const [canNext, setCanNext] = useState(false)
        const [stylesSelected, setStylesSelected] = useState<number[]>(user.profile.styles_of_videomaker.length > 0 ? styles() : []);

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/styles", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        job: "video_maker",
                        styles: stylesSelected.map((i) => stylesList.videoMakerStyles[i])
                    }
                )
            });
        }

        useEffect(() => {
            setCanNext(stylesSelected.length > 0);
        }, [stylesSelected])

        return (
            <>
                <Header onNext={undefined} canNext={canNext} />
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <label className="form-label fw-semibold">{translate("select_your_video_style")}</label>
                        <TextInputTags not_found_message={translate("video_style_not_found")} value={stylesSelected} onTags={(selections: number[]) => { setStylesSelected(selections) }} suggestions={videomaker_styles} placeholder={"" + translate("choice_video_style")} />
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const CountriesAvailable = () => {

        const travels: any = () => {
            let l: number[] = [];
            for (const travel of user.profile.travels) {
                let i = 0;
                for (const country of getCountries) {
                    if (country.cca2 == travel) {
                        l = [...l, i]
                        break;
                    }
                    i++;
                }
            }
            return l;
        }

        const dontTravels: any = () => {
            let l: number[] = [];
            for (const travel of user.profile.dont_travels) {
                let i = 0;
                for (const country of getCountries) {
                    if (country.cca2 == travel) {
                        l = [...l, i]
                        break;
                    }
                    i++;
                }
            }
            return l;
        }

        const [canNext, setCanNext] = useState(false)
        const [countriesTravels, setCountriesTravels] = useState<number[]>(user.profile.travels.length > 0 ? travels() : []);
        const [countriesDontTravels, setCountriesDontTravels] = useState<number[]>(user.profile.dont_travels.length > 0 ? dontTravels() : []);

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/travels", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        travels: countriesTravels.map((i) => getCountries[i].cca2)
                    }
                )
            });
            const response2 = await fetch(config.API + "/user/update/dont-travels", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        travels: countriesDontTravels.map((i) => getCountries[i].cca2)
                    }
                )
            });
        }

        useEffect(() => {
            setCanNext(/*countriesTravels.length > 0 && */countriesDontTravels.length > 0);
        }, [countriesTravels, countriesDontTravels])

        return (
            <>
                <Header onNext={undefined} canNext={canNext} />
                <div className="row countries-available gy-3 justify-content-center">
                    
                    <div className="col-12 col-md-6">
                        <div className="bg-light border p-4 position-relative h-100">
                            <div className="d-flex align-items-center">
                                <div className="position-absolute rounds bg-success border-0"></div>
                                <h3 className="mb-0 lh-1 text-center fs-3 w-100 ">{translate("i_travel")}</h3>
                            </div>
                            <div className="mt-4">
                                <label className="form-label fw-semibold">{translate("select_country")}</label>
                                <TextInputTags not_found_message={translate("country_not_found")} value={countriesTravels} onTags={(countries: number[]) => { setCountriesTravels(countries) }} suggestions={countries} ignores={countriesDontTravels.map((index) => countries[index])} placeholder={"" + translate("choice_a_countries")} />
                            </div>
                        </div>
                    </div>
               
                    <div className="col-12 col-md-6">
                        <div className="bg-light border p-4 position-relative h-100">
                            <div className="d-flex align-items-center">
                                <div className="me-3 rounds bg-danger border-0"></div>
                                <h3 className="mb-0 lh-1 text-center fs-4 w-100 ">{translate("i_dont_travel")}</h3>
                            </div>
                            <div className="mt-4">
                                <label className="form-label fw-semibold">{translate("select_country")}</label>
                                <TextInputTags not_found_message={translate("country_not_found")} value={countriesDontTravels} onTags={(countries: number[]) => { setCountriesDontTravels(countries) }} suggestions={countries} ignores={countriesTravels.map((index) => countries[index])} placeholder={"" + translate("choice_a_countries")} />
                            </div>
                        </div>
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const LanguagesSpeaks = () => {

        const [canNext, setCanNext] = useState(false)

        const speaks: any = () => {
            let l: number[] = [];
            for (const language of user.profile.languages_speaks) {
                let i = 0;
                for (const lang of languages) {
                    if (lang == language) {
                        l = [...l, i]
                        break;
                    }
                    i++;
                }
            }
            return l;
        }

        const [selections, setSelections] = useState<number[]>(user.profile.languages_speaks.length > 0 ? speaks() : []);

        useEffect(() => {
            setCanNext(selections.length > 0)
        }, [selections])

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/speaks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        languages: selections.map((i) => languages[i])
                    }
                )
            });
        }

        return (
            <>
                <Header onNext={undefined} canNext={canNext} />
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <label className="form-label fw-semibold">{translate("select_languages")}</label>
                        <TextInputTags not_found_message={translate("language_not_found")} value={selections} onTags={(selections: number[]) => { setSelections(selections) }} suggestions={languagesList} placeholder={translate("search_a_language")} />
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={canNext} />
            </>
        )
    }

    const socialnetworksLinks: any = {
        instagram: "https://www.instagram.com/nom_utilisateur",
        facebook: "https://www.facebook.com/nom_utilisateur",
        twitter: "https://www.twitter.com/nom_utilisateur",
        pinterest: "https://www.pinterest.com/nom_utilisateur",
        linkedin: "https://www.linkedin.com/nom_utilisateur",
        spotify: "https://open.spotify.com/user/nom_utilisateur",
        youtube: "https://www.youtube.com/channel/nom_utilisateur",
        tiktok: "https://www.tiktok.com/nom_utilisateur",
    }

    const SocialNetworkChildren = (socialNetworks: any, socialnetworks: any, key: string) => {
        const socialnetwork = socialNetworks[key];

        const [link, setLink] = useState<string>(socialnetworks[key]);

        const isValid = () => {
            const test = socialnetwork.regex.test(link)
            if (test) {
                socialnetworks[key] = link;
            } else {
                socialnetworks[key] = undefined;
            }
            return test;
        }

        return (
            <div className="py-3 col-12 col-md-6">
                <label className="form-label fw-semibold">{socialnetwork.common}</label>
                <div className="d-flex">
                    <div style={{ width: "4rem" }} className={(!isValid() ? "bg-white" : "bg-primary") + " border-for-input border-start border-top border-bottom min-h-100 d-flex justify-content-center align-items-center"}>
                        {isValid() &&
                            <i className="text-white fs-5 fa-solid fa-check"></i>
                        }
                    </div>
                    <Input className="w-100" type="text" value={link} onChange={(v: string) => { setLink(v) }} placeholder={socialnetworksLinks[key]} />
                </div>
            </div>
        )
    }

    const SocialNetwork = () => {

        const socialNetworks: any = require('@/assets/socialnetworks').default;

        let socialnetworks: any = {};
        Object.keys(socialNetworks).map((key: any) => {
            socialnetworks[key] = user.profile.socialnetworks[key] != undefined ? user.profile.socialnetworks[key] : undefined;
        });

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/socialnetworks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        ...socialnetworks
                    }
                )
            });
        }

        return (
            <>
                <Header onNext={undefined} canNext={true} />
                <h6 className="text-center text-">{translate("select_your_socialnetworks_and_put_links")}</h6>
                <div className="row gy-0">
                    {
                        Object.keys(socialNetworks).map((key: any, index: number) => {
                            return SocialNetworkChildren(socialNetworks, socialnetworks, key)
                        })
                    }
                </div>
                <SettingsFooter onSave={onSave} canSave={true} />
            </>
        )
    }

    const Reachability = () => {

        const [show_phone_number, setShowPhoneNumber] = useState(user.profile.show_phone_number)
        const [show_email, setShowEmail] = useState(user.profile.show_email)

        const onSave = async () => {
            const response = await fetch(config.API + "/user/update/reachability", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getSession()
                },
                body: JSON.stringify(
                    {
                        show_phone_number,
                        show_email
                    }
                )
            });
        }

        return (
            <>
                <Header onNext={undefined} canNext={true} />
                <div className="form-switch py-5 px-0 px-md-5">
                    <div className="border-top px-lg-3 py-4 d-flex align-items-center">
                        <label className="form-check-label" >{translate("show_email")}</label>
                        <input checked={show_email} onChange={(e) => setShowEmail(e.target.checked)} className="ms-0 ms-md-auto form-check-input" type="checkbox" />
                    </div>
                    <div className="border-top px-lg-3 py-4 d-flex align-items-center">
                        <label className="form-check-label" >{translate("show_phone_number")}</label>
                        <input checked={show_phone_number} onChange={(e) => setShowPhoneNumber(e.target.checked)} className="ms-0 ms-md-auto form-check-input" type="checkbox" />
                    </div>
                </div>
                <SettingsFooter onSave={onSave} canSave={true} />
            </>
        )
    }


    const SubscriptionPayment = () => {
        const [message, setMessage] = useState<any>(null)

        const [promotion, setPromotion] = useState<string>("");
        const [promotionUsed, setPromotionUsed] = useState<string | undefined>(undefined);

        const [reduction, setReduction] = useState<number>(1);

        const validPromotion = () => {
            return promotionUsed == undefined && promotion.length > 0;
        }

        const [error, setError] = useState<boolean | undefined>(false);

        const applyPromotion = async () => {
            if (!validPromotion()) return;

            const reduction = await DiscountAPI.getReduction(promotion);
            if (reduction != null) {
                setPromotionUsed(promotion);
                setReduction(reduction);
                setError(undefined)
            } else {
                setError(true);
            }
        }
        const date = new Date();
        const expireAt = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

        const stripePromise = loadStripe(config.stripe_public_key);
        const [canCancel, setCanCancel] = useState(true)

        // const payment = (payment_id: number) => {
        //     return new Promise(async (resolve, reject) => {
        //         const payment = await SubscriptionAPI.payment(getSession(), payment_id, props.lang, promotionUsed ?? undefined);

        //         const data = payment;
        //         const success = data.message === "subscription_success";

        //         if (success) {
        //             setTimeout(() => {
        //                 toStep(steps.length - 1);
        //             }, 2000)
        //             setCanCancel(false)
        //         }
        //         resolve({ color: success ? "green" : "red", message: data.message })
        //     })
        // }

        return (
            <>
                <div className="pt-5 row justify-content-end gy-4 m-0 gx-2">
                    <div className="col-12 text-center mt-0">
                        <span className="text-white bg-black px-2 fs-1 fw-bold">FIND<span className="text-primary">.</span>ME</span>
                        <p className="mt-4 lh-sm">
                            {translate("subscription_message")}
                        </p>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="h-100 shadow-sm p-3 d-flex flex-column align-items-start justify-content-end border">
                            <ul className="list-unstyled ">
                                {(promotionUsed != undefined) && (
                                    <>
                                        <li>
                                            <strong><span className="text-uppercase">{translate("discount_code")}</span> : </strong>{promotionUsed}
                                        </li>
                                        <li>
                                            <strong><span className="text-uppercase">{translate("reduction")}</span> : </strong>{reduction * 100}%
                                        </li>
                                    </>
                                )
                                }
                                <li>
                                    <strong><span className="text-uppercase">{translate("total")}</span> : </strong>{(config.price * (1 - reduction))}€
                                </li>
                                <li>
                                    <strong><span className="text-uppercase">{translate("expire_at")}</span> : </strong>{expireAt.toLocaleString()}
                                </li>
                            </ul>
                            <div className="w-100">
                                <label className="form-label fw-semibold">{translate("promo_code")}</label>
                                <div className="d-flex gap-2 mb-2">
                                    <Input disabled={promotionUsed != undefined} value={promotion} type="text" onChange={(v: string) => { setPromotion(v) }} placeholder={""} />
                                    <button onClick={(e) => applyPromotion()} disabled={!validPromotion()} className={"btn btn-primary"}>{translate("use")}</button>
                                </div>
                                {((error != undefined && error) && (
                                    <span style={{ color: "var(--bs-red)" }}>{translate("discount_code_not_found")}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-7">
                        <Elements stripe={stripePromise}>
{/*                             <CardForm lang={props.lang} translate={translate} payment={payment} disabled={message && message.color === "danger"} >
                                {
                                    message && (
                                        <p style={{ color: "var(--bs-" + message.color + ")" }} className={"mb-0 lh-sm"}>{translate(message.message)}</p>
                                    )
                                }
                            </CardForm> */}
                        </Elements>
                    </div>
                </div>
            </>
        )
    }

    const Subscription = () => {

        // const [payment, setPayment] = useState<boolean>();

        return (
            <>
                <Header onNext={undefined} canNext={user.profile.subscription != undefined} />
                {user.profile.subscription ? (
                    <div className="pt-5 row justify-content-end gy-4">
                        <div className="col-12 text-center  my-4">
                            <Image src="/assets/imgs/logo-black.svg" alt="Findme" width={280} height={140} />
                            <p className="mt-4 lh-sm">
                                {translate("has_subscription_message")}
                            </p>
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className="bg-light p-4 border">
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <strong><span className="text-uppercase">{translate("total")}</span> : </strong>{user.profile.subscription.price}€
                                    </li>
                                    <li>
                                        <strong><span className="text-uppercase">{translate("expire_at")}</span> : </strong>{new Date(user.profile.subscription.expireAt).toLocaleString()}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
{/*                         {payment ? (
                            <SubscriptionPayment />
                        ) : (
                            <div className="pt-5 row justify-content-end gy-4">
                                <div className="col-12 text-center my-4">
                                    <Image src="/assets/imgs/logo-black.svg" alt="Findme" width={280} height={140} />
                                    <p className="mt-4 lh-sm">
                                        {translate("subscription_message")}
                                    </p>
                                </div>

                                <div className="col-auto d-flex align-items-center">
                                    <span className="fs-2 lh-1 text-uppercase"><strong>30€<span className="fs-4">/{translate("year")}</span></strong></span>
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-primary fw-semibold" onClick={(e) => { setPayment(true) }}>{translate("buy_subscription")}</button>
                                </div>
                            </div>
                        )} */}
                    </>
                )}
            </>
        )
    }

    let steps: any[] = [];

    const hasJob = (name: string) => {
        for (const job of user.profile.jobs) {
            if (job.name == name)
                return true;
        }
        return false;
    }

    const initSteps = () => {
        steps = [...steps,
        {
            title: translate("personal_informations"),
            content: PersonalInformations(),
            state: () => true,
            update: () => {

            }
        }]
        if (user.profile.role == ARTIST) {
            steps = [...steps, {
                title: translate("media_contents"),
                state: () => (user.profile.photos.length > 0 || user.profile.polas.length > 0 || user.profile.videos.length > 0),
                content: <MediaContents />,
                update: () => { }
            }]
        }
        if (hasJob("photographer")) {
            steps = [...steps,
            {
                title: translate("style_of_photo"),
                state: () => (user.profile.styles_of_photographer.length > 0),
                content: <StyleOfPhoto />,
                update: () => { }
            }
            ]
        }
        if (hasJob("video_maker")) {
            steps = [...steps,
            {
                title: translate("style_of_video"),
                state: () => (user.profile.styles_of_videomaker.length > 0),
                content: <StyleOfVideo />,
                update: () => { }
            }
            ]
        }

        const filtered = user.profile.jobs.filter((job: any) => {
            return (
                job.name == "model" ||
                job.name == "actor" ||
                job.name == "influencer" ||
                job.name == "dancer" ||
                job.name == "appearing"
            )
        });

        if (user.profile.role == ARTIST && filtered.length > 0) {
            steps = [...steps, {
                title: translate("body_physics"),
                state: () => (user.profile.body != null),
                content: <Physics />,
                update: () => { }
            }]
        }
        steps = [...steps,
        {
            title: translate("description"),
            state: () => (user.profile.description != null && user.profile.description.length > 0),
            content: <Description />,
            update: () => { }
        }]
        if (user.profile.role == ARTIST) {
            steps = [...steps,
            {
                title: translate("country_available"),
                state: () => (/*    user.profile.travels.length > 0 &&*/ user.profile.dont_travels.length > 0),
                content: <CountriesAvailable />,
                update: () => { }
            },
            {
                title: translate("languages_speak"),
                content: <LanguagesSpeaks />,
                state: () => (user.profile.languages_speaks.length > 0),
                update: () => { }
            }]
        }
        steps = [...steps,
        {
            title: translate("social_networks"),
            content: <SocialNetwork />,
            state: () => (Object.keys(user.profile.socialnetworks).length > 0),
            update: () => { }
        }]
        if (user.profile.role == ARTIST) {
            steps = [...steps,
            {
                title: translate("subscription"),
                state: () => { return user.profile.subscription != undefined },
                content: <Subscription />,
                update: () => { }
            },
            {
                title: translate("reachability"),
                content: <Reachability />,
                state: () => true,
                update: () => { }
            }]
        }
        steps = [...steps,
        {
            title: "",
            content: <Finish />,
            state: () => true,
            update: () => { }
        }
        ]
    }

    initSteps();

    const getPercentage = () => {
        let count = 0;
        for (const step of steps) {
            if (step.state())
                count++;
        }
        return ((count) * 100 / steps.length).toFixed();
    }

    const [showSteps, setShowSteps] = useState(false);

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={props.lang} user={user} fixedTop={true} />
            <section className="flex-grow-1 bg-light settings m-0 gx-3 gy-3 p-2 py-5 d-flex justify-content-center">
                <div className="col-12 col-xxl-10 row">
                    <div className="col-12 col-lg-4 text-black d-flex flex-column pb-3">
                        <div className="pb-0 bg-white border border-gray h-100">
                            <div className="p-4 pb-3">
                                <Link href={"/" + props.lang + "/profile/" + user.profile.firstname + "-" + user.profile.lastname + "-" + user.profile.id} className="btn btn-black w-100 fs-7">
                                    <div className="py-3">
                                        <i className="text-white me-2 fa-solid fa-eye"></i>
                                        {translate("preview_profil")}
                                    </div>
                                </Link>
                                <h5 className="text-black text-center mt-3 mb-0 lh-1 fw-bold">{translate("my_profile")}</h5>
                                <div className="d-flex justify-content-center">
                                    <span className="fs-6 fw-semibold text-center">{translate("complete")} {getPercentage()}%</span>
                                </div>
                            </div>
                            <div className="progress-container w-100">
                                <div style={{ width: getPercentage() + "%" }} className="progress-progression bg-black">
                                </div>
                            </div>
                            
                        <div className="d-block d-lg-none">
                            <div className="p-3 d-flex justify-content-end ">
                                salut
                            </div>
                        </div>
                       
                            <div className={(showSteps ? "" : "d-none d-lg-block") + " d-flex flex-column"} >
                                {
                                    steps.map((step_: any, index: number) => {

                                        const Status = () => {

                                            const state = step_.state();

                                            if (state) {
                                                return (
                                                    <div className="ms-auto step-status text-white bg-primary d-flex" >
                                                        <i className="fa-solid fa-check m-auto"></i>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="ms-auto step-status bg-white d-flex border border-2">
                                                    </div>
                                                )
                                            }
                                        }

                                        if (index + 1 == steps.length) return;

                                        return (

                                            <div key={index} tabIndex={1} onClick={(e) => toStep(index)} className="step" >
                                                {index == step ?
                                                    (
                                                        <div className={"d-flex flex-column " + (index > 0 && "border-bottom")}>
                                                            <div className="bg-primary d-flex align-items-center p-3 text-white">
                                                                <p className="mb-0 lh-1">{step_.title}</p>
                                                                <Status />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex flex-column">
                                                            <div className="d-flex p-3 text-black align-items-center border-bottom">
                                                                <p className="mb-0 lh-1">{step_.title}</p>
                                                                <Status />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )

                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="bg-white border border-gray d-flex flex-column p-4 text-black">
                            <div className="pt-5 pb-0 d-flex flex-column my-auto">
                                {showComponent != undefined ?
                                    <>
                                        <div className="position-relative mb-4">
                                            <h3 className="d-block d-md-none pb-3 text-center mx-auto">{showComponent.title}</h3>
                                            <div className="position-relative mb-5 mb-md-4">
                                                {step != 0 && (
                                                    <div className="position-absolute h-100 d-flex">
                                                        <a href="#" onClick={(e) => setShowComponent(undefined)} className="text-decoration-none text-black my-auto">
                                                            <i className="fa-solid fa-chevron-left me-2"></i>
                                                            {translate("back")}
                                                        </a>
                                                    </div>
                                                )}
                                                <h3 className="d-none d-md-block text-center mb-4 mb-auto mx-auto">{showComponent.title}</h3>
                                            </div>
                                        </div>
                                        <div className="my-5 d-flex flex-column my-auto">
                                            {showComponent.content}
                                        </div>
                                    </>
                                    :
                                    (<>
                                        {steps[step].content}
                                    </>)
                                }
                            </div>
                        </div></div>
                </div >
            </section >
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const res = await fetch(config.API + '/jobs/all');
    const data = await res.json();
    var jobs: string[] = data.jobs;

    data.jobs.map((job: any) => {
        jobs = [...jobs, job.name];
    });

    const datas = await ServerSide.getServerSideProps(context, "settings");


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
    }
}
