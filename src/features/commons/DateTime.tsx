import React from "react";
import PrimeReact from "primereact/api";
import classNames from "classnames";

export interface DateTextProps {
    date?: Date;
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
    className?: string;
}
export function DateText(props: DateTextProps) {
    return (
        <span className={classNames(props.className)}>
            {new Date(props.date || "").toLocaleString(PrimeReact.locale, {
                day: "numeric",
                month: props.month || "long",
                year: "numeric"
            })}
        </span>
    );
}

export interface TimeTextProps {
    time: Date;
    timeZone?: string;
    className?: string;
}
export function TimeText(props: TimeTextProps) {
    return (
        <span className={classNames(props.className)}>
            {new Date(props.time).toLocaleTimeString(PrimeReact.locale, {
                hour: "2-digit",
                hour12: false,
                minute: "2-digit",
                timeZone: props.timeZone,
                timeZoneName: "short"
            })}
        </span>
    );
}
