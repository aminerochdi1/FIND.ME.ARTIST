import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    const translate = useTranslation().t;

    useEffect(() => {
        const consentCookie = localStorage.getItem('cookieConsent');
        if (consentCookie == undefined) {
            setShowConsent(true);
        }
    }, []);

    const cookieConsent = (consent: boolean) => {
        localStorage.setItem('cookieConsent', consent+"");
        setShowConsent(false);
    };

    return showConsent ? (
        <div className="cookie-consent d-flex flex-column">
            <p>{translate("cookie_alert")}</p>
            <div className="d-flex gap-2 mx-auto">
                <button className="accept" onClick={(e) => cookieConsent(true)}>{translate("accept")}</button>
                <button className="deny" onClick={(e) => cookieConsent(false)}>{translate("deny")}</button>
            </div>
        </div>
    ) : null;
};

export default CookieConsent;
