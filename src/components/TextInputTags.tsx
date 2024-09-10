import React, { useState } from "react"
import { useTranslation } from "react-i18next";

const TextInputTags = (props: { value: any, ignores?: string[], onTags: any, not_found_message: string, placeholder: string, suggestions: string[] }) => {

    const [tags, setTags] = useState<number[]>(props.value ? props.value : [])
    const suggestions = props.suggestions;
    const onTags = props.onTags;
    const ignores = props.ignores != null ? props.ignores : [];

    const [search, setSearch] = useState("");
    const [focus, setFocus] = useState(false);

    const translate = useTranslation().t;

    const handleTag = (tag: number) => {
        if (tags.includes(tag)) {
            removeTag(tag);
        } else {
            setSearch("")
            const tags_ = [...tags, tag];
            setTags(tags_);
            onTags(tags_);
        }
    }
    const unfocus = () => {
        setTimeout(() => {
            setFocus(false)
        }, 200);
    }

    const removeTag = (tagTarget: number) => {
        const tags_ = tags.filter((tag) => tag !== tagTarget);
        setTags(tags_)
        onTags(tags_);
    }

    const suggestionFilter = (suggestion: string) => translate(suggestion).toLowerCase().includes(search.toLowerCase());
    const ignored = (suggestion: any) => { return ignores.includes(suggestion) };
    const suggestionMap = (suggestion: any, index: number) => {
        if (suggestionFilter(suggestion) && !ignored(suggestion)) {
            return (
                <li key={index} className="list-group-item" onClick={(e) => { handleTag(index) }}>
                    {translate(suggestion)}
                </li>
            );
        }
    }

    return (
        <>
            <div className="">
                <div className="d-flex flex-column form-group tag-input-container">
                    <ul className={"list-group " + (focus ? " show" : "")} id="tag-suggestions">
                        {
                            suggestions
                                .filter(suggestionFilter).length > 0 ?
                                suggestions.map(suggestionMap)
                                :
                                <li className="list-group-item">
                                    {props.not_found_message}
                                </li>
                        }
                    </ul>
                    <input
                        onFocus={() => setFocus(true)}
                        onBlur={() => unfocus()}
                        type="text"
                        className="form-control input-component"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                        id="tag-input" placeholder={props.placeholder} />
                </div>
                <div id="selected-tags">
                    {tags.map((tag, index) => {
                        return <span key={index} className="d-flex fw-semibold tag p-0 m-0 px-3 py-1">
                            <button onClick={(e) => removeTag(tag)} type="button" className="tag-delete border-0 bg-transparent p-0 m-0 me-2">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>
                            {translate(suggestions[tag])}
                        </span>
                    })}
                </div>
            </div>
        </>
    )
}

export default TextInputTags;