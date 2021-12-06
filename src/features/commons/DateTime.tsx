import React from "react";
import classNames from "classnames";

import { useSelector } from "react-redux";
import { selectStorageLanguage } from "../app/appSlice";

export interface DateTextProps {
    date: Date;
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
    className?: string;
}
export function DateText(props: DateTextProps) {
    const language = useSelector(selectStorageLanguage);
    return (
        <span className={classNames(props.className)}>
            {new Date(props.date).toLocaleString(language, {
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
    const language = useSelector(selectStorageLanguage);
    return (
        <span className={classNames(props.className)}>
            {new Date(props.time).toLocaleTimeString(language, {
                hour: "2-digit",
                hour12: false,
                minute: "2-digit",
                timeZone: props.timeZone,
                timeZoneName: "short"
            })}
        </span>
    );
}
