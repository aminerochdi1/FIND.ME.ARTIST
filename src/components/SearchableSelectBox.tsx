import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { setTimeout } from "timers";

interface Option {
    id: number;
    label: string;
}

const SearchableSelectBox = (props: { required?: boolean, emptyMessage?: any, selected?: number, className?: string, disabled?: boolean, select: any, not_found_message: string, children: string, elements: string[] }) => {

    const required = props.required ?? false;
    const emptyMessage = props.emptyMessage ?? false;

    const [getError, setError] = useState<string | undefined>(undefined)
    const [show, setShow] = useState(false)

    var focus = useRef(false);
    const setFocus = (v: boolean) => {
        focus.current = v;
    }

    const focus_ = async () => {
        setFocus(true);
        setError(undefined);
    }

    const checkEmpty = () => {
        if (required) {
            if (value == undefined) {
                setError(emptyMessage ?? "Is empty");
            } else {
                setError(undefined)
            }
        }
    }

    const blur_ = () => {
        setFocus(false);
        checkEmpty();
    }

    const unshow_ = () => {
        setTimeout(() => {
            if (focus.current === true) return;
            setShow(false);
            setSearch("")
        }, 200)
    }

    const click = () => {
        setFocus(!focus.current)
        setShow(!show)
    }

    const className = props.className ?? "";

    const translate = useTranslation().t;

    const [value, setValue] = useState(props.selected);
    const [search, setSearch] = useState("");

    const handleValue = (index: number) => {
        setValue(index);
        setError(undefined)
        props.select(index);
    }

    const elements = props.elements;
    const searchFilter = (element: string) => { return element.toLowerCase().includes(search.toLowerCase()); }
    const searchMap = (country: string, index: number) => {
        return searchFilter(country) && (
            <li onClick={(e) => { handleValue(index) }} key={index} className="element">
                {country}
            </li>
        )
    };

    return (
        <div className="d-flex flex-column">
            <div className={"searchable-selectbox " + className}>
                <div tabIndex={0} onBlur={() => { blur_(); unshow_() }} onClick={(e) => { click(); }} className="inner">
                    <span className={value === undefined || elements.length == 0 ? "placeholder" : ""}>{value === undefined || elements.length == 0 ? props.children : elements[value]}</span>
                    <button className={"arrow-btn " + (show ? "showed" : "")}><i className="fa-solid fa-chevron-down"></i></button>
                </div>
                <div className={"dropdown " + (show ? "show" : "")}>
                    <input value={search} onChange={(e) => { setSearch(e.target.value) }} onFocus={() => focus_()} onBlur={() => { blur_(); unshow_() }} className="seach-input w-100" type="text" placeholder={translate("search")+""} />
                    <ul className={"elements " + (show ? " show" : "")}>
                        {
                            elements.filter(searchFilter).length > 0 ?
                                elements.map(searchMap)
                                :
                                <li className="element">
                                    {translate(props.not_found_message)}
                                </li>
                        }
                    </ul>
                </div>
            </div>
            {getError && (
                <p className="text-danger mb-0 lh-1 mt-2">{getError}</p>
            )}
        </div>
    );
};

export default SearchableSelectBox;
