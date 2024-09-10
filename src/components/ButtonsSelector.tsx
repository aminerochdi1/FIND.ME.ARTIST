import React, { useEffect, useState } from "react"

const ButtonsSelector = (props: { selected: any, selection: string[], value: any, canUnset?: boolean }) => {

    const [selected, setSelected] = useState(props.value != undefined ? props.value : -1);
    const canUnset = props.canUnset ?? false;

    const select = (index: number) => {
        if(canUnset && selected == index){
            props.selected(undefined);
            setSelected(undefined)
            return;
        }
        props.selected(index);
        setSelected(index)
    }

    return (
        <div className="row g-2">
            {props.selection.map((child: any, index: number) => {
                return (
                    <div key={index} className="col">
                        <button onClick={(e) => { select(index) }} type="button" className={"btn btn-selector " + (selected == index ? "selected" : "") + " w-100"}>
                            {child}
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

export default ButtonsSelector;