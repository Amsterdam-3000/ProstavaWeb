import React from "react";
import classNames from "classnames";

import { Calendar as CalendarPrime, CalendarProps as CalendarPrimeProps } from "primereact/calendar";

export interface CalendarProps extends CalendarPrimeProps { 
    readOnly?: boolean;
}

export function Calendar(props: CalendarProps) {
    return (
        <CalendarPrime
            {...props}
            disabled={props.disabled || props.readOnly}
            inputClassName={classNames(props.inputClassName, { "opacity-100": props.readOnly })}
            showIcon={props.readOnly ? false : props.showIcon}
        />
    );
}