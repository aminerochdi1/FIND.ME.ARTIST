import Image from 'next/image'
// import { Inter } from 'next/font/google'
import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ClientSide } from '@/sides/client/ClientSide';

export default function NotFoundPage(props: { user: any, lang?: undefined | string }) {


  const user = ClientSide.parseUser(props.user);
  ClientSide.setLanguage("fr")
  const translate = useTranslation().t;

  return (
    <>
{/*       <Head>
        <title>FIND.ME | 404</title>
        <meta name="description" content="" />
      </Head>

      <Navbar lang="en" user={user} />
      <header className="header main bg-black vh-100 text-white">
        <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
          <div className="col-md-5 p-5 text-center blur border border-white">
            <h1>404</h1>
            <h3 className="mt-3 fs-3">{translate("page_not_found")}</h3>
            <p>{translate("page_not_found_message")}</p>
            <hr />
            <Link href="/" className="mt-3 fw-semibold btn border-white fs-4 btn-primary">
              <i className="fa-solid fa-chevron-left me-2"></i>
              {translate("back_to_home")
              }</Link>
          </div>

        </div>
      </header> */}
    </>
  )
}
