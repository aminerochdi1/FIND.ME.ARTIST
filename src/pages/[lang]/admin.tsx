import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import { ClientSide } from '@/sides/client/ClientSide';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { DiscountAPI } from '@/api/DiscountAPI';
import { getSession } from '@/handler/session';
import { useRouter } from 'next/router';
import Discount from '@/sides/server/Discount';

export default function Create(
    props: {
        host: string,
        lang: string,
        title: string,
        user: any,
        codes: any
    }) {

    const user = ClientSide.parseUser(props.user);
    const lang = props.lang;
    const codes = JSON.parse(props.codes);

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const [code, setCode] = useState<string>("");
    const [reduction, setReduction] = useState<number>(0);
    const [expireAt, setExpireAt] = useState<string>(new Date().toISOString().split("T")[0]);

    const router = useRouter();

    const createCode = async () => {
        const { json } = await DiscountAPI.createDiscountCode(getSession(), code, reduction, expireAt);
        if (json != undefined && json.message == "code_created") {
            router.reload();
        }
    }

    const disabledCode = async (id: number, disabled: boolean) => {
        const { json } = await DiscountAPI.changeStateDiscountCode(getSession(), id, disabled);
        if(json != undefined && json.message == "code_updated"){
            router.reload();
        }
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true}>
            </Navbar>
            <div className="bg-light flex-grow-1">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-12 bg-white py-4">
                            <div className="d-flex px-3">
                                <h1>Gérer les bons de réductions</h1>
                                <a role="button" data-bs-toggle="modal" href="#createCode" className="ms-auto border-black btn btn-success">Créer un nouveau bon</a>
                            </div>
                            <hr />
                            <div className="d-flex flex-column gap-3">
                                {
                                    codes.map((code: any, index: number) => {
                                        return (
                                            <div key={index} className="border shadow p-3">
                                                <div className="d-flex">
                                                    <div className="d-flex flex-column">
                                                        <h3 className="lh-1">
                                                            {
                                                                code.code
                                                            }
                                                        </h3>
                                                        <p className="mb-0 fs-5">Fin du code le <span className="fw-semibold">{new Date(code.expireAt).toLocaleString()}</span></p>
                                                    </div>
                                                    <div className="ms-auto my-auto">
                                                        <span className="fs-1 fw-semibold my-auto p-2 bg-success border border-black">-{code.reduction * 100}%</span>
                                                    </div>
                                                    {
                                                        !code.disabled ? (
                                                            <>
                                                                <button onClick={(e) => disabledCode(code.id, true)} className="ms-3 fw-semibold btn btn-danger border-black">Désactiver le code</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={(e) => disabledCode(code.id, false)} className="ms-3 fw-semibold btn btn-success border-black">Activer le code</button>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div><div className="modal modal fade" id="createCode" aria-hidden="true" aria-labelledby="createCodeLabel" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createCodeLabel">Nouveau bon de réduction</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-3 bg-white">
                                <div className="col-12 d-flex flex-column">
                                    <label className="fw-semibold mb-1" htmlFor="code">Code de réduction</label>
                                    <Input dynamicValue={code} placeholder='Nom de la réduction' onChange={(v: string) => { setCode(v) }} type="text" />
                                </div>
                                <div className="col-12 d-flex flex-column">
                                    <label className="fw-semibold mb-1" htmlFor="reduction">Pourcentage de reduction</label>
                                    <Input dynamicValue={reduction + ""} placeholder='Valeur de réduction en pourcentage' onChange={(v: number) => { setReduction(v) }} type="number" max={99} />
                                </div>
                                <div className="col-12 d-flex flex-column">
                                    <label className="fw-semibold mb-1" htmlFor="expiration">Date d&apos;expiration</label>
                                    <DatePicker defaultValue={expireAt} min={new Date().toISOString().split("T")[0]} onChange={(date: string) => setExpireAt(date)} placeholder={""} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={(e) => createCode()} disabled={!(code != "" && reduction != 0)} className="btn btn-primary">Créer le nouveau bon</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer lang={props.lang} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const user = await ServerSide.getUser(context);
    const datas = await ServerSide.getServerSideProps(context, "administration", user);

    if (user == null)
        return {
            redirect: {
                destination: "/" + datas.lang + "/signin",
                permenant: false
            }
        }

    if (!user.isAdmin)
        return {
            redirect: {
                destination: "/" + datas.lang + "/",
                permenant: false
            }
        }

    const { DiscountCode } = require('../../../models');
    const discountCodes = await DiscountCode.findAll();

    return {
        props: {
            ...datas,
            codes: JSON.stringify(discountCodes.sort((code: any) => !code.disabled ? -1 : 1))
        }
    };
}

