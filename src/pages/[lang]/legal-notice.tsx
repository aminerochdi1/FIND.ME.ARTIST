import Image from 'next/image'
import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import config from "../../config.json"
import { getSessionWithServerSideProps } from '@/handler/session';
import JobsAPI from '@/api/JobsAPI';
import { ServerSide } from '@/sides/server/ServerSide';
import Footer from '@/components/Footer';
import { ClientSide } from '@/sides/client/ClientSide';

export default function Home(props: { lang: string, user: any, jobs: string[], title: string }) {

  const user = props.user;

  const translate = useTranslation().t;
  ClientSide.setLanguage(props.lang)

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={translate("home_page_description") + ""} />
      </Head>

      <Navbar lang={props.lang} user={user} fixedTop={true} />
      <section className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto p-3">
        <div className="py-5">
          <h1>Legal Notice</h1>
          <p>{'Effective as of 28/07/2023'}</p>
          <p>{'In accordance with the provisions of Articles 6-III and 19 of Law No. 2004-575 of June 21, 2004, known as the Digital Economy Confidence Act (L.C.E.N.), users and visitors, hereinafter referred to as the "User," of the website findmeartist.com, hereinafter referred to as the "Site," are informed of the following legal notice.'}</p>
          <p>{'Connection to and navigation on the Site by the User implies full and unconditional acceptance of these legal notices.'}</p>
          <p>{'These legal notices are accessible on the Site under the "Legal Notice" section.'}</p>

          <h2 className="text-primary pt-5">ARTICLE 1 - PUBLISHER</h2>
          <p>{'The Site is published by FIND.ME, a sole proprietorship with a capital of 0 euros, registered with the Trade and Companies Register of _______________ under number 530237239, with its registered office located at 133 Avenue Marc Sangnier,'}</p>
          <p>{'Phone number: 07,'}</p>
          <p>{'Email address: contact@findmeartist.com.'}</p>
          <p>{'VAT number: _______________'}</p>
          <p>{'The Publishing Director is Ludwig PREYNAT, hereinafter referred to as the "Publisher."'}</p>

          <h2 className="text-primary pt-5">ARTICLE 2 - HOSTING</h2>
          <p>{'The hosting of the Site is provided by the company OVH, with its registered office located at 2, rue Kellermann, 59100 Roubaix, with the phone number: 1007 + contact email address.'}</p>

          <h2 className="text-primary pt-5">ARTICLE 3 - ACCESS TO THE SITE</h2>
          <p>{'The Site is accessible from anywhere, 7 days a week, 24 hours a day, except in cases of force majeure, scheduled or unscheduled interruption, resulting from the need for maintenance.'}</p>
          <p>{'In the event of modification, interruption, or suspension of the Site, the Publisher cannot be held responsible.'}</p>

          <h2 className="text-primary pt-5">ARTICLE 4 - DATA COLLECTION</h2>
          <p>{'The Site ensures the User\'s collection and processing of personal information in accordance with privacy regulations in accordance with Law No. 78-17 of January 6, 1978, relating to data processing, files, and freedoms.'}</p>
          <p>{'In accordance with the Data Protection Act of January 6, 1978, the User has the right to access, rectify, delete, and object to their personal data. The User exercises this right:'}</p>
          <ul>
            <li>by email to the email address contact@findmeartist.com</li>
          </ul>

          <p>{'Any use, reproduction, dissemination, marketing, or modification of all or part of the Site without the Publisher\'s authorization is prohibited and may result in legal action and prosecution, as provided for in the Intellectual Property Code and the Civil Code.'}</p>
        </div>
      </section>
      <Footer lang={props.lang} />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);

  const datas = await ServerSide.getServerSideProps(context, "legal_notice");
  const user = await getSessionWithServerSideProps(context.req);

  return {
    props: {
      ...datas,
      jobs,
      user
    }
  };
}