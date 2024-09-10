import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import Input from '@/components/Input';
import JobsAPI from '@/api/JobsAPI';
import SearchableSelectBox from '@/components/SearchableSelectBox';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientSide } from '@/sides/client/ClientSide';
import getCountries from '@/assets/countries.json';
import { AD, CREATE_ADVERTISEMENT, LISTINGS, PROFILE, buildRoute } from '@/handler/router';
import { RoleType } from '@/classes/RoleType';
import { fetchCitiesData } from '@/api/CitiesAPI';
import { Ad } from '@/classes/Ad';
import { AdsAPI } from '@/api/AdsAPI';
import { getSession } from '@/handler/session';
import { CountriesHandler } from '@/handler/CountriesHandler';
import TextUtils from '@/utils/text.utils';
import { buildMediaURL } from '@/utils/client.utils';
import TimeUtils from '@/utils/time.utils';
import DatePicker from '@/components/DatePicker';
import AdComponent from '@/components/Ad';
import { AdBuilder } from '@/builders/AdBuilder';

export default function Search(
    props: {
        host: string,
        lang: string,
        title: string,
        ads: string,
        user?: any,
    }) {

    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const ads = JSON.parse(props.ads);
    const user = props.user != undefined ? ClientSide.parseUser(props.user) : undefined;

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
                <h1 className="text-center py-3">{translate("my_ads")}</h1>
            </Navbar>
            <div className="bg-light ">
                <div className="container py-3 min-vh-100">
                    <div className="row g-4">
                        {
                            ads == undefined && (
                                <span className="pt-5 text-dark fs-3 w-100 text-center">{translate("loading")}</span>
                            )
                        }
                        {
                            (ads != undefined && ads.length > 0) && ads.map((ad: any, index: number) => {

                                return (
                                    <AdComponent key={index} ad={ad} lang={lang} />
                                )
                            })
                        }
                        {
                            (ads != undefined && ads.length == 0) && (
                                <span className="pt-5 text-dark fs-3 w-100 text-center">{translate("any_ads_founds")}</span>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);
    const user = await ServerSide.getUser(context);
    const datas = await ServerSide.getServerSideProps(context, "my_ads", user);

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

    const { Ads, AdsHasJobs, Job } = require('../../../../models');

    const adsFetched = await Ads.findAll({
        where: {
            profile_id: user.profile.id
        },
        limite: 9,
        include: [
            {
                model: AdsHasJobs,
                include: [
                    {
                        model: Job,
                    }
                ]
            }
        ],
    })

    let ads: Ad[] = [];
    if (adsFetched.length > 0) {
        for (const ad of adsFetched) {
            ads.push(await AdBuilder.build(ad))
        }
    }

    return {
        props: {
            ...datas,
            jobs,
            ads: JSON.stringify(ads)
        }
    };
}

