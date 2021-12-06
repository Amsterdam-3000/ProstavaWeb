import React from "react";
import classNames from "classnames";

import { useController } from "react-hook-form";

export interface FieldProps {
    children: React.ReactElement;
    label?: string;
    className?: string;
}

export function Field(props: FieldProps) {
    const {
        fieldState: { error }
    } = useController({ name: props.children.props["name"] });

    return (
        <span className={classNames(props.className, "field p-float-label")}>
            {error && <small className="p-error">{error.message}</small>}
            {props.children}
            <label htmlFor={props.children.props["id"]} className={classNames({ "p-error": error })}>
                {props.label}
            </label>
        </span>
    );
}
