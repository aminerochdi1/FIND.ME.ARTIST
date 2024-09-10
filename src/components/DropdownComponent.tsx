import React, { useState } from "react"

const DropdownComponent = (props: { title: string, children: any, show?: boolean }) => {

    const title = props.title;
    const children = props.children;

    const [show, setShow] = useState(props.show != undefined ? props.show : true)
    const [defaultShowed, setDefaultShowed] = useState(props.show != undefined && props.show);

    return (
        <div className="dropdown">
            <div className="d-flex" onClick={(e) => { setDefaultShowed(false); setShow((show) => !show)}} tabIndex={1}>
                <span className="fs-5 lh-sm mb-2 fit-content-width">{title}</span>
                <button className={"ms-auto arrow-btn "+ (defaultShowed ? "default-show " :"") + (show ? "showed" : "")}><i className="fa-solid fa-chevron-down"></i></button>
            </div>
            <div className={"dropdown-container gap-2 " + (show && "show")}>
                {children.length > 0 ? (
                children.map((children: any) => {
                    return children
                })) : 
                (
                    children
                )}
            </div>
        </div>
    )
}

export default DropdownComponent;