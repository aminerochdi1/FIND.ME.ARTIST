import { isInteger } from "@/utils/utils";
import checkerUtils from "@/utils/checker.utils";
import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next";

const Input = (props: {
    dynamicValue?: string,
    onKeyPress?: any,
    className?: string,
    regex?: RegExp,
    maxLength?: number,
    disabled?: boolean,
    name?: string,
    max?: number,
    min?: number,
    value?: any,
    type: string,
    onChange: any,
    placeholder: string,
    required?: boolean,
    parent?: any,
    invalidRegex?: any,
    emptyMessage?: any,
    incomplete?: any,
}) => {

    const type = props.type;
    const onChange = props.onChange;
    const dynamicValue = props.dynamicValue;
    const onKeyPress = props.onKeyPress;
    const regex: any = props.regex;
    const className = props.className ?? "";
    const required = props.required ?? false;
    const parent = props.parent;
    const emptyMessage = props.emptyMessage;
    const invalidRegex = props.invalidRegex;
    const incomplete = props.incomplete;

    const [getError, setError] = useState<string | undefined>(undefined)
    const [value, setValue] = useState(props.value == undefined ? "" : props.value);

    const update = (e: any) => {

        if (type === "number" && e.target.value != "") {
            const value = parseInt(e.target.value);
            if (!isInteger(e.target.value))
                return;
            if ((props.min != undefined && value < props.min) || (props.max != undefined && value > props.max))
                return;
        }

        let newValue: any = e.target.value;
        if (type === "tel" && newValue != "") {

            newValue = newValue.replace(/(\d{2})/g, '$1 ').replace(/\s+/g, ' ').trim();

            const phoneString = newValue.replace(/[\s-]+/g, '');
            const regex = /^\d+$/;
            const isValid = regex.test(phoneString);

            if (isValid && newValue.length == 14) {
                setError(undefined)
            } else {
                if (!isValid || newValue.length > 14) {
                    setError(undefined)
                    return;
                } else {
                    setError(incomplete ?? "Need complete");
                }
            }
        }

        checkEmpty(newValue);

        if (value.length > 0 && regex != undefined && !regex.test(value))
            setError(invalidRegex ?? "Invalid value")


        if (newValue != undefined && value != null && newValue.length >= value.length) {
            if (type === "firstname")
                if (!checkerUtils.FIRSTNAME_INPUT.test(newValue)) return;
            if (type === "lastname")
                if (!checkerUtils.LASTNAME_INPUT.test(newValue)) return
        }

        setValue(newValue);
        onChange(newValue)
    }

    const inputRef = useRef<any>(null);

    const checkEmpty = (value: string) => {
        if (required) {
            if (value.length == 0) {
                setError(emptyMessage ?? "Is empty");
            } else {
                if (value.length > 0 && regex != undefined && !regex.test(value))
                    return setError(invalidRegex ?? "Invalid value")
                setError(undefined)
            }
        }
    }

    const onFocus = () => {
        setError(undefined);
    }

    const onBlur = () => {
        checkEmpty(value);
    }

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="d-flex flex-column w-100">
            <div className="d-flex">
                <input
                    onBlur={onBlur}
                    ref={inputRef}
                    name={props.name != undefined ? props.name : undefined}
                    onKeyPress={props.onKeyPress != undefined ? props.onKeyPress : undefined}
                    type={showPassword ? "text" : type === "number" ? "text" : type}
                    className={(type == "password" ? "border-end-0" : "")+" form-control input-component " + className /*+ (getError != undefined ? " border border-2 border-danger" : "")*/}
                    onChange={update}
                    value={dynamicValue != undefined ? dynamicValue : value}
                    onFocus={() => {
                        onFocus();
                        try {
                            if (value != undefined && value != "" && inputRef != null && inputRef != undefined && inputRef.current != null)
                                inputRef.current.selectionStart = value.length;
                        } catch (error) { }
                    }}
                    required={required}
                    placeholder={props.placeholder}
                    pattern={type === "tel" ? "[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}" : undefined}
                    disabled={props.disabled} />
                {type == "password" && (
                    <button onBlur={() => setShowPassword(false)} type="button" onClick={(e) => {setShowPassword((password) => !password)}} style={{backgroundColor: "rgb(79, 71, 82, .8)"}} className="px-4 btn btn-secondary border border-start-0 border-white text-white"><i className="fa-solid fa-eye"></i></button>       
                )}
            </div>
            {getError && (
                <p className="text-danger mb-0 lh-1 mt-2">{getError}</p>
            )}
        </div>
    )
}

export default Input;