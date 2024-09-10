import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/css/global.css'
import "@/assets/scss/custom.scss";
import "@/assets/scss/searchableselectbox.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import "@/assets/css/textinputtags.css";
import "@/assets/css/dropdown-component.css";
import "@/assets/css/checkbox-component.css";
// import "@/assets/css/searchableselectbox.css";
import "@/assets/css/links-selector.css";
import "@/assets/css/profile/component.css";
import "@/assets/css/checkbox.css";
import "@/assets/css/switch.css";
import dynamic from 'next/dynamic';

import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import CookieConsent from '@/components/CookieConsent';

SwiperCore.use([Navigation, Pagination]);


export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("bootstrap/dist/css/bootstrap.min.css");
    require("src/assets/scss/custom.scss");
    require("src/assets/css/global.css");

  }, []);


  const dateMax = new Date('2023-08-08T03:00:00');
  const [showPaymentRequired, setShowPaymentRequired] = useState<boolean>(true);

  return (
    <>
      <Component {...pageProps} />
      <CookieConsent />
    </>
  )
}