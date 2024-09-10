import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

const LinksSelector = (props: { children:any, links:any[] }) => {

    const [show, setShow] = useState(false)

    const links = props.links;
    const translate = useTranslation().t;

    return (
        <div tabIndex={1} onClick={(e) => setShow(!show)} onBlur={() => setShow(false)} className="links-selector-component">
            <>{props.children}</>
            <div className={"links-selector " + (show ? "show" : "")}>
                <ul className={"elements " + (show ? " show" : "")}>
                    {
                        links.map((link:any, index:number) => {
                            return (<li key={index} className="element d-flex" onClick={link.onClick}>
                                {translate(link.translate)}
                                {link.html != undefined && (
                                    link.html
                                )}
                            </li>)
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default LinksSelector;