import { isInteger } from '@/utils/utils';
import React, { useState } from 'react';

const InputRange = (props: { min: number, max: number, value?: number, extension?: string, onChange?: any }) => {

    const min = props.min;
    const max = props.max;

    const [value, setValue] = useState<number | undefined>(props.value != undefined ? props.value : (props.max / 2));

    if (props.value == undefined && props.onChange != undefined) {
        props.onChange(value)
    }

    const onChange = (e: any) => {
        if (e.target.value != "") {
            const value: any = parseInt(e.target.value);
            if (!isInteger(value))
                return;
        }
        if (props.onChange != undefined) {
            props.onChange(e.target.value)
        }
        setValue(e.target.value);
    }

    return (
        <div className="d-flex">
            <input type="range" className="my-auto form-range w-75 pe-3" onChange={onChange} min={props.min} max={props.max} value={value} />
            <div className="d-flex text-black col-4 justify-content-center fw-semibold bg-light border">
                <input pattern="[0-9]*" type="number" onBlur={(e) => {
                    if (value != undefined && value < min)
                        setValue(min)
                    if (value != undefined && value > max)
                        setValue(max)
                }} onChange={onChange} className="py-3 rounded-0 bg-light fw-semibold form-control input-range w-100 text-center bg-transparent p-2" value={value} />
                {props.extension != undefined && (
                    <span className="mx-2 my-auto">{props.extension}</span>
                )}
            </div>
        </div>
    );
};

export default InputRange;