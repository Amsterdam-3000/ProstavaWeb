import React from "react";
import classNames from "classnames";

import { useController } from "react-hook-form";

import { Dropdown } from "primereact/dropdown";
import { CalendarNavigatorTemplateParams } from "primereact/calendar";
import { Calendar, CalendarProps } from "../prime/Calendar";

export interface CalendarDateButtonProps extends CalendarProps {
    name: string;
    text?: string;
}

export function CalendarDateButton(props: CalendarDateButtonProps) {
    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            required: `${props.text || props.name.replace(/^./, (match) => match.toUpperCase())} is required`
        }
    });

    if (field.value === undefined) {
        return null;
    }

    const navigatorTemplate = (e: CalendarNavigatorTemplateParams) => (
        <Dropdown
            value={e.value}
            options={e.options}
            onChange={(event) => e.onChange(event.originalEvent, event.value)}
            className="line-height-1 mr-2"
        />
    );

    return (
        <Calendar
            {...props}
            value={new Date(field.value)}
            onChange={(e) => {
                field.onChange(e.value ? (e.value as Date).toJSON() : null);
            }}
            className={classNames(props.className, {
                "p-invalid": fieldState.invalid
            })}
            monthNavigator
            monthNavigatorTemplate={navigatorTemplate}
            yearNavigator
            yearNavigatorTemplate={navigatorTemplate}
            yearRange={props.yearRange ? props.yearRange : `1970:${new Date().getFullYear()}`}
            //TODO Locale format?
            dateFormat="d MM yy"
            showIcon
            readOnlyInput
        />
    );
}
