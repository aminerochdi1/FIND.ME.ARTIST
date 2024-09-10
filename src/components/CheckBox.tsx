import React, { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

const CheckBox = (props: { name?: string, checked?: boolean, onChange?: any, children: any }) => {

    const children = props.children;
    const onChange = props.onChange != undefined ? props.onChange : () => {};
    const name = props.name ?? "checkbox-"+uuidv4();

    const [checked, setChecked] = useState(props.checked != undefined ? props.checked : false);

    return (
        <>
            <div className="d-flex align-items-center form-check">
                <input checked={checked} onChange={(e) => { setChecked(e.target.checked); props.onChange(e.target.checked); }} type="checkbox" className="form-check-input mt-0 checkbox-component" id={name} />
                <label className="form-check-label ms-2" htmlFor={name}>{children}</label>
            </div>
        </>
    )
}

export default CheckBox;