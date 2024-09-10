import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import JobsAPI from '@/api/JobsAPI';
import { ClientSide } from '@/sides/client/ClientSide';
import { RoleType } from '@/classes/RoleType';
import { Ad } from '@/classes/Ad';
import AdComponent from '@/components/Ad';
import { AdBuilder } from '@/builders/AdBuilder';
import { useEffect, useState } from 'react';
import ScreenSizeDetector from '@/components/ScreenSizeDetector';
import CalendarAPI from '@/api/CalendarAPI';
import { getSession } from '@/handler/session';
import TextUtils from '@/utils/text.utils';
import ScreenUtils from '@/utils/screen.utils';

export default function Search(
    props: {
        host: string,
        title: string,
        lang: string,
        user?: any,
    }) {

    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const user = props.user != undefined ? ClientSide.parseUser(props.user) : undefined;

    const daysOfTheWeek = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ]

    const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
    ];
    const weeks = [1, 2, 3, 4, 5];

    const now = new Date();

    const [month, setMonth] = useState(now.getMonth())
    const [year, setYear] = useState(now.getFullYear())

    const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

    useEffect(() => {
        const fetchUnavaibilities = async () => {
            const dates = (await CalendarAPI.getUnvailabilities(user.profile.id, month + 1, year)).map((unavailability: any) => new Date(unavailability.date));
            setUnavailableDates(dates);
        }

        fetchUnavaibilities();
    }, [month, year])

    const downMonth = () => {
        if (month == 0) {
            setMonth(11);
            setYear((year) => year - 1);
        } else {
            setMonth((month) => month - 1)
        }
    }

    const upMonth = () => {
        if (month == 11) {
            setMonth(0);
            setYear((year) => year + 1);
        } else {
            setMonth((month) => month + 1)
        }
    }

    const today = () => {
        setMonth(now.getMonth())
        setYear(now.getFullYear())
    }

    const unavailable = () => {
        return (
            <span style={{ whiteSpace: "nowrap" }} className="h-100 d-flex align-items-center justify-content-center w-100">
                <div className="circle-unavailable me-2"></div>
                <span className=" small d-none d-lg-inline text-nowrap w-100 ">
                    {translate("unavailable")}
                </span>
            </span>
        )
    }


    const filter = (target: Date, date: Date) => {
        return date.getFullYear() == target.getFullYear() && date.getMonth() == target.getMonth() && date.getDate() == target.getDate()
    }

    const containsDate = (target: Date) => {
        return unavailableDates.filter((date: Date) => filter(target, date)).length > 0;
    }

    const handleDate = async (target: Date) => {
        if (containsDate(target)) {
            setUnavailableDates((dates) => dates.filter((date) => !filter(target, date)))
        } else {
            setUnavailableDates((dates) => [...dates, target])
        }

        const { json, response } = await CalendarAPI.handleDate(getSession(), target.getFullYear(), target.getMonth() + 1, target.getDate());
    }

    const days = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();

        const dayNumbers: any[] = [];

        for (let i = 0; i < startingDay; i++) {
            dayNumbers.push('');
        }
        for (let i = 1; i <= daysInMonth; i++) {
            dayNumbers.push(i);
        }

        return weeks.map((week: number, week_count: number) => {
            return <tr key={week_count}>
                {daysOfTheWeek.map((day_: string, day_count: number) => {
                    const day = dayNumbers[(week_count * daysOfTheWeek.length) + day_count + 1];
                    const active = year == now.getFullYear() && month == now.getMonth() && day == now.getDate();
                    const disabled = day === undefined || day == '';
                    const isUnavailable = containsDate(new Date(year, month, day));

                    return (
                        <th key={day_count} style={{ maxWidth: "1rem" }} className={"calendar-day p-0 text-end fs-5" + (disabled ? " table-disabled" : "")}>
                            <button disabled={disabled} onClick={(e) => handleDate(new Date(year, month, day))} className={"position-relative h-100 w-100 btn btn-available d-flex flex-column p-0 border-0 text-black"}>
                                <div className={"d-flex h-100 w-100 " + (active && "text-white")}>
                                    {
                                        isUnavailable ? (
                                            <div className="position-absolute top-0 end-0 start-0 bottom-0 opacity-75" style={{ backgroundColor: "var(--bs-red)" }}>
                                            </div>
                                        ) : active ? (
                                            <div className="position-absolute top-0 end-0 start-0 bottom-0 opacity-75" style={{ backgroundColor: "var(--bs-primary)" }}>
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <div className="position-absolute top-0 end-0 start-0 bottom-0 d-flex">
                                        <span className={"ps-2 pt-2 " + (isUnavailable ? "text-white" : active ? "text-black" : "")}>
                                            {day}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </th>
                    )
                })}
            </tr>
        })
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true} />
            <div className="flex-grow-1 bg-light m-0">
                <div className="container py-3">
                    <div className="row gy-3 m-0">
                        <div className="col-12 col-md-4 col-xl-3">
                            <div className="border bg-white">
                                <div className="pt-5">
                                    <div className="px-2">
                                        <h2 className="text-initial text-center">{translate("calendar")}</h2>
                                        <p className="lh-sm fw-semibold text-center py-4">
                                            {translate("availability_description")}
                                        </p>
                                    </div>
                                    {
                                        unavailableDates.sort((a, b) => a.getTime() - b.getTime()).map((date: Date, index: number) => {
                                            return (
                                                <div className={"border-top " + (date.getDate() == new Date().getDate() && "bg-primary text-white")} key={index}>
                                                    <div className="py-3 px-3 d-flex align-items-center">
                                                        <i className="fa-regular fa-calendar-xmark fs-1"></i>
                                                        <span className="ps-3 fw-semibold fs-5 text-nowrap w-100 text-center">{TextUtils.capitalizeFirstLetter(translate(daysOfTheWeek[date.getUTCDay()])) + " " + date.getDate() + " " + translate(months[date.getMonth()])}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 col-xl-9 d-flex flex-column">
                            <div className="bg-white p-2 p-md-4 border">
                                <div className="d-grid d-sm-flex align-items-center mb-3">
                                    <span className="fs-3 fw-semibold mb-0 lh-1">{translate(months[month])} {year}</span>
                                    <div className="mt-3 mt-sm-0 ms-sm-auto d-flex">
                                        <button onClick={(e) => today()} className="btn btn-black me-2">{translate("today")}</button>
                                        <button onClick={(e) => downMonth()} className="btn btn-black d-flex align-items-center"><i className="fa-solid fa-chevron-left fs-5"></i></button>
                                        <button onClick={(e) => upMonth()} className="btn btn-black d-flex align-items-center"><i className="fa-solid fa-chevron-right fs-5"></i></button>
                                    </div>
                                </div>
                                <table className="table table-bordered table-white">
                                    <thead>
                                        <tr>
                                            {
                                                daysOfTheWeek.map((day: string, index: number) => {
                                                    return (
                                                        <th key={index} scope="col">{translate(day).substring(0, 3) + "."}</th>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {days()}
                                    </tbody>
                                </table>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex gap-2 align-items-center">
                                        <div style={{ height: "20px", width: "40px", backgroundColor: "var(--bs-red)" }} className="opacity-75 mb-auto">
                                        </div>
                                        <span className="small">{translate("calendar_unavailability_day_legend")}</span>
                                    </div>
                                    <div className="d-flex gap-2 align-items-center">
                                        <div style={{ height: "20px", width: "40px", backgroundColor: "var(--bs-primary)" }} className="opacity-75 mb-auto">
                                        </div>
                                        <span className="small">{translate("calendar_current_day_legend")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);
    const datas = await ServerSide.getServerSideProps(context, "my_calendar");

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
