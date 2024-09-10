import React, { useEffect, useState } from "react"
import Input from "./Input";
import { ClientSide } from "@/sides/client/ClientSide";

const DatePicker = (props: { name?: string, placeholder?: string, max?: string, min?: string, id?: string, onChange?: any, defaultValue: any }) => {

    const onChange = props.onChange ?? undefined;
    const name = props.name ?? undefined;
    const id = props.id ?? undefined;
    const min = props.min ?? undefined;
    const max = props.max ?? undefined;
    const defaultValue = props.defaultValue ?? undefined;
    
    const placeholder = props.placeholder ?? undefined;

    return (
        <input placeholder={placeholder} className="form-control" onChange={(e) => { props.onChange != undefined && onChange(e.target.value) }} defaultValue={defaultValue} type="date" min={min} max={max} name={name} id={id} />
    )
}

export default DatePicker;