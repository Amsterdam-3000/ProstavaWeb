import React from "react";
import classNames from "classnames";

import { Dropdown as DropdownPrime, DropdownProps as DropdownPrimeProps } from "primereact/dropdown";

export interface DropdownProps extends DropdownPrimeProps {
    readOnly?: boolean;
    loading?: boolean;
}

export function Dropdown(props: DropdownProps) {
    return (
        <DropdownPrime
            {...props!}
            disabled={props.disabled || props.loading || props.readOnly}
            className={classNames(props.className, { "opacity-100": props.readOnly })}
            dropdownIcon={props.loading ? "pi pi-spin pi-spinner" : !props.readOnly ? "pi pi-chevron-down" : ""}
        />
    );
}