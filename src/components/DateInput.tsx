import React, { useEffect, useState } from "react"
import Input from "./Input";

const DateInput = (props: { onChange?: any }) => {

    const onChange = props.onChange ?? undefined;

    const [day, setDay] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [year, setYear] = useState<number>();
    
    useEffect(() => {
        if(onChange == undefined)return;
        if (year != undefined && month != undefined && day != undefined){
            const date = new Date(year, month - 1, day);
            onChange(date);
        }
    }, [day, month, year, onChange])

    return (
        <div className="d-flex gap-2">
            <Input value={day} onChange={(v: string) => setDay(parseInt(v))} type="number" min={0} max={31} placeholder="DD" />
            <Input value={month} onChange={(v: string) => setMonth(parseInt(v))} type="number" min={0} max={12} placeholder="MM" />
            <Input value={year} onChange={(v: string) => setYear(parseInt(v))} type="number" min={0} max={new Date().getFullYear() + 100} placeholder="YYYY" />
        </div>
    )
}

export default DateInput;