import React from "react";
import classNames from "classnames";
import { useController } from "react-hook-form";

import { Dropdown } from "primereact/dropdown";
import { CalendarNavigatorTemplateParams } from "primereact/calendar";
import { Calendar, CalendarProps } from "../prime/Calendar";
import { localeOption } from "primereact/api";

export interface CalendarDateTimeProps extends CalendarProps {
    name: string;
    text?: string;
}

export function CalendarDateTime(props: CalendarDateTimeProps) {
    const t = localeOption("form")[props.name];

    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            required: props.required && t && t["isRequired"]
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
            yearRange={props.yearRange ? props.yearRange : `1970:${new Date().getFullYear() + 1}`}
            dateFormat="d MM yy"
            showIcon={!props.timeOnly}
            readOnlyInput
        />
    );
}
