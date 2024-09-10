import Image from 'next/image'
import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import { Splide, SplideSlide } from '@splidejs/react-splide';

import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import config from "../../config.json"
import { getSessionWithServerSideProps } from '@/handler/session';
import JobsAPI from '@/api/JobsAPI';
import { ServerSide } from '@/sides/server/ServerSide';
import { ClientSide } from '@/sides/client/ClientSide';
import Footer from '@/components/Footer';
import { PROFILES_SEARCH, SEARCH, SIGNUP, buildRoute } from '@/handler/router';
import Link from 'next/link';

export default function Home(props: { lang: string, user: any, jobs: string[], title: string }) {

  const user = props.user;
  const partners = config.partners;

  const jobs = [
    "actor",
    "model",
    "appearing",
    "dancer",
    "makeup_artist",
    "photographer",
    "video_maker",
    "hairdresser",
    "fashion_designer",
    "influencer",
    "producer",
    "musician",
    "vocalist",
    "sound_engineer",
    "art_director",
  ]

  const translate = useTranslation().t;
  ClientSide.setLanguage(props.lang)

  return (
    <>
      <Head>
        <title>FIND.ME - Artist&apos;s Social Network</title>
        <meta name="description" content={translate("home_page_description")+""} />
      </Head>

      <Navbar fixedTop={false} lang={props.lang} user={user} />

      <header className="header bg-black vh-100 text-white">
        <div className="vh-100 d-flex flex-column justify-content-center">
          <div className=" col-11 mx-auto my-auto pt-5 col-12 col-lg-10">
            <div className="text-center pt-5 mt-5">
              <h1 className="title mt-5" style={{ paddingTop: "6rem", whiteSpace: "pre-wrap" }}>{translate("home_title")}</h1>
              <h2 className="display-6 highlight">{translate("home_subtitle")} </h2>
            </div>
          </div>

          <div className="mb-5">
            <Splide options={{
              type: 'loop',
              perPage: 6,
              perMove: 3,
              pagination: false,
              gap: '1rem',
              breakpoints: {
                768: {
                  perPage: 2,
                  arrows: true,
                  autoplay: true,
                  gap: '0.5rem',
                  perMove: 2
                },
                1024: {
                  perPage: 3,
                  autoplay: false
                },
                1280: {
                  perPage: 4,
                  autoplay: false,
                  perMove: 4
                },
              }
            }}>
              {
                jobs.map((filter: any, key: number) => {
                  return (
                    <SplideSlide key={key}>
                      <a href={buildRoute(props.lang, PROFILES_SEARCH + "?job=" + filter)} className="text-decoration-none text-white splide-container d-flex align-items-center justify-content-center m-2">
                        {translate(filter)}
                      </a>
                    </SplideSlide>
                  )
                })
              }
            </Splide>
          </div>
        </div>
      </header>

      <section className="bg-secondary">
        <div className="text-white">
          <div className="row m-0 mt-5 mt-md-0">
            <div className="col-xl-6 col-12 d-flex flex-column">
              <div className="p-4 p-md-5">
                <h1 className="display-2">{translate("join_a_network")}</h1>
                <p className="my-5 lh-sm fs-5 text-justify">{translate("join_a_network_text")}</p>
              </div>
            </div>
            <div className="pb-5 pt-lg-0 col-xl-6 col-12 d-flex align-items-center justify-content-center bg-black">
              <div className="bg-black px-0 px-md-5">
                <div className="text-white d-flex flex-column justify-content-center">
                  <div className="text-center p-5 pb-0 w-auto mx-auto">
                    <h2 className="display-6 mb-0 d-flex lh-1"><div className="rounds purple me-2 my-auto" style={{ width: "0.85em", height: "0.85em" }}></div>{translate("subscription_title")}</h2>
                    <div className="border-bottom border-white w-100 mt-4"></div>
                  </div>

                  <div className="row g-4 m-0 pb-5 mt-1">
                    <div className="col-12 col-lg-4">
                      <div className="bg-dark py-0 px-3 h-100 d-flex flex-column">
                        <div className="text-center my-3">
                          <Image width={124} height={124} src="/assets/imgs/icon-eye.svg" alt="Eye" />
                          <h5 className="fs-6 fw-semibold">{translate("choice_1_title")}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-4">
                      <div className="bg-dark py-0 px-3 h-100 d-flex flex-column">
                        <div className="text-center my-3">
                          <Image width={100} height={99} className="py-3" src="/assets/imgs/icon-fly.svg" alt="Avion en papier" />
                          <h5 className="fs-6 fw-semibold">{translate("choice_2_title")}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-4">
                      <div className="bg-dark py-0 px-3 h-100 d-flex flex-column">
                        <div className="text-center my-3">
                          <Image width={124} height={124} src="/assets/imgs/icon-bag.svg" alt="Sac à main" />
                          <h5 className="fs-6 fw-semibold">{translate("choice_3_title")}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={buildRoute(props.lang, SIGNUP)} className="btn btn-lg btn-black mx-auto">{translate("signup")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container text-black py-5 d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center mt-3 mb-5">
            <h2 className="ps-2 ">{translate("why_choice")} <span className="text-white bg-black px-2">FIND<span className="text-primary">.</span>ME</span></h2>
          </div>
          <div className="row g-4 m-0">
            <div className="col-12 col-lg-4">
              <div className="bg-light py-2 px-5 h-100 d-flex flex-column">
                <div className="text-center my-3">
                  <img src="/assets/imgs/icon-eye.svg" alt="Oeil" />
                  <h5>{translate("choice_1_title")}</h5>
                </div>
                <div className="my-auto">
                  <p>{translate("choice_1_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="bg-light py-2 px-5 h-100 d-flex flex-column">
                <div className="text-center my-3">
                  <img className="py-3" src="/assets/imgs/icon-fly.svg" alt="Avion en papier" />
                  <h5>{translate("choice_2_title")}</h5>
                </div>
                <div className="my-auto">
                  <p>{translate("choice_2_text")}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="bg-light py-2 px-5 h-100 d-flex flex-column">
                <div className="text-center my-3">
                  <img src="/assets/imgs/icon-bag.svg" alt="Sac à main" />
                  <h5>{translate("choice_3_title")}</h5>
                </div>
                <div className="my-auto">
                  <p>{translate("choice_3_text")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     

      <section className="bg-light text-black">
        <div className="row m-0 g-0">
          <div className="col-12 col-lg-6">
            <div className="h-100">
              <div className="h-100 position-relative">
                <img className="object-fit-contain" src="/assets/illustrations/agency.webp" alt="Agence" />
                <div className="position-absolute top-0 start-0 end-0 bottom-0 image-over"></div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="h-100 p-4 p-md-5 d-flex flex-column">
              <div className="my-auto">
                <h2 className="mb-4 display-5">{translate("who_is")} <span className="text-white bg-black px-2">FIND<span className="text-primary">.</span>ME</span> ?</h2>
                <p className="fs-5 lh-sm text-justify">
                  {translate("who_is_paragraph_1")}
                </p>
                <p className="fs-5 lh-sm text-justify">
                  {translate("who_is_paragraph_2")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="container py-5">
          <div className="d-flex justify-content-center mt-3 mb-5">
            <h2 className="ps-2 ">{translate("our_partners")}</h2>
          </div>

          <Splide options={{
            type: 'loop',
            perPage: 4,
            perMove: 1,
            gap: "2rem",
            breakpoints: {
              768: {
                perPage: 2,
                arrows: false,
                autoplay: true
              },
              1024: {
                perPage: 3,
                arrows: false,
                autoplay: false
              },
              1280: {
                perPage: 4,
                arrows: true,
                autoplay: false
              },
            }
          }}>
            {
              partners.map((partner, key) => {
                return (
                  <SplideSlide key={key}>
                    <div className="bg-light d-flex justify-content-center align-items-center p-4 py-5 h-100">
                      <img src={"/assets/imgs/brand-" + partner.path + "."+partner.extension} alt={partner.path} />
                    </div>
                  </SplideSlide>
                )
              })
            }
          </Splide>
        </div>
        <div className="d-flex w-100 justify-content-center py-5  ">
          <div className="border-black border-top col-4">

          </div>
        </div>
      </section>
      <Footer lang={props.lang} />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);

  const datas = await ServerSide.getServerSideProps(context, "home");
  const user = await getSessionWithServerSideProps(context.req);

  return {
    props: {
      ...datas,
      jobs,
      user
    }
  };
}