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
  const lang = props.lang;

  const translate = useTranslation().t;
  ClientSide.setLanguage(props.lang)

  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={translate("home_page_description") + ""} />
      </Head>

      <Navbar lang={lang} user={user} fixedTop={true} />
      <section className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto p-3">
        <div className="py-5">
          <h1>Terms and Conditions of Use</h1>
          <p>{'In effect as of 28/07/2023'}</p>
          <p>{'These Terms and Conditions of Use (referred to as "T&Cs") aim to legally govern the provision of the website and services by FIND.ME and to define the terms of access and use of the services by "User."'}</p>
          <p>{'These T&Cs are accessible on the website under the "T&Cs" section.'}</p>
          <p>{'Any registration or use of the website implies the User\'s acceptance without any reservation or restriction of these T&Cs. When registering on the website via the Registration Form, each User expressly agrees to these T&Cs by checking the box preceding the following text: "I acknowledge that I have read and understood the T&Cs and I accept them."'}</p>
          <p>{'In case of non-acceptance of the T&Cs stipulated in this agreement, the User must refrain from accessing the services offered by the website.'}</p>
          <p>{'findmeartist.com reserves the right to unilaterally modify the content of these T&Cs at any time.'}</p>

          <h2 className="text-primary pt-5">Article 1: Legal Notices</h2>
          <p>{'The website findmeartist.com is published by the sole proprietorship company FIND.ME with a capital of 0 euros, registered with the RCS of _______________ under number 530237239, and its registered office is located at 133 Avenue Marc Sangnier.'}</p>
          <p>{/*'Phone number: 07 76 04 76 65'*/}</p>
          <p>{'Email address: contact@findmeartist.com.'}</p>
          <p>{'The Publishing Director is: Ludwig PREYNAT'}</p>
          <p>{'The website findmeartist.com is hosted by the company OVH, whose registered office is located at 2, rue Kellermann, 59100 Roubaix, with the phone number: 1007.'}</p>

          <h2 className="text-primary pt-5">Article 2: Access to the Website</h2>
          <p>{'The website findmeartist.com allows the User free access to the following services:'}</p>
          <ul>
            <li>social network</li>
            <li>messaging</li>
            <li>photo hosting</li>
            <li>search engine</li>
            <li>filter</li>
            <li>matchmaking</li>
            <li>availability calendar</li>
            <li>ads</li>
            <li>profiles</li>
          </ul>
          <p>{'The website is freely accessible from any location to any User with internet access. All costs incurred by the User to access the service (computer hardware, software, internet connection, etc.) are at their expense.'}</p>
          <p>{'Non-member Users do not have access to the reserved services. To access these services, they must register by completing the form. By agreeing to register for the reserved services, the member User agrees to provide sincere and accurate information regarding their civil status and contact details, particularly their email address.'}</p>
          <p>{'To access the services, the User must then identify themselves using their username and password, which will be provided to them after registration.'}</p>
          <p>{'Any regularly registered member User may also request their unsubscribe by going to the dedicated page on their personal space. This will be effective within a reasonable time.'}</p>
          <p>{'Any event due to a case of force majeure resulting in a malfunction of the website or server and subject to any interruption or modification for maintenance purposes does not engage the responsibility of findmeartist.com. In such cases, the User agrees not to hold the publisher liable for any interruption or suspension of service, even without notice.'}</p>
          <p>{'The User has the possibility to contact the website by email at the publisher\'s email address provided in ARTICLE 1.'}</p>

          <h2 className="text-primary pt-5">Article 3: Data Collection</h2>
          <p>{'The website ensures the User\'s collection and processing of personal information in compliance with privacy regulations in accordance with Law No. 78-17 of January 6, 1978, relating to data processing, files, and freedoms.'}</p>
          <p>{'Under the Data Protection Act of January 6, 1978, the User has the right to access, rectify, delete, and oppose their personal data. The User exercises this right:'}</p>
          <ul>
            <li>by email to the email address contact@findmeartist.com</li>
          </ul>

          <h2 className="text-primary pt-5">Article 4: Intellectual Property</h2>
          <p>{'Trademarks, logos, signs, as well as all the content of the website (texts, images, sound, etc.) are protected by the Intellectual Property Code, particularly by copyright.'}</p>
          <p>{'The trademark FINDME is a registered trademark by _______________. Any representation and/or reproduction and/or partial or total exploitation of this trademark, of any nature whatsoever, is strictly prohibited.'}</p>
          <p>{'The User must seek prior authorization from the website for any reproduction, publication, copy of various content. The User agrees to use the website\'s content strictly for private purposes only; any use for commercial and advertising purposes is strictly prohibited.'}</p>
          <p>{'Any total or partial representation of this website by any means whatsoever, without the express authorization of the website operator, would constitute an infringement punishable by Article L 335-2 and following of the Intellectual Property Code.'}</p>
          <p>{'It is recalled in accordance with Article L122-5 of the Intellectual Property Code that the User who reproduces, copies, or publishes the protected content must cite the author and its source.'}</p>
        </div>
      </section>
      <Footer lang={lang} />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);

  const datas = await ServerSide.getServerSideProps(context, "terms_and_conditions");
  const user = await getSessionWithServerSideProps(context.req);

  return {
    props: {
      ...datas,
      jobs,
      user
    }
  };
}