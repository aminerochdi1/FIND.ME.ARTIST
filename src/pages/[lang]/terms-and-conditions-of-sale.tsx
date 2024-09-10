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
          <h1>Terms and Conditions of Sale</h1>
        </div>
      </section>
      <Footer lang={lang} />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);

  const datas = await ServerSide.getServerSideProps(context, "terms_and_conditions_of_sale");
  const user = await getSessionWithServerSideProps(context.req);

  return {
    props: {
      ...datas,
      jobs,
      user
    }
  };
}