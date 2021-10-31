import React from "react";
import classNames from "classnames";

import { Dropdown as DropdownPrime, DropdownProps as DropdownPrimeProps } from "primereact/dropdown";

interface DropdownProps extends DropdownPrimeProps {
    readOnly?: boolean;
    loading?: boolean;
}

export function Dropdown(props: DropdownProps) {
    return (
        <DropdownPrime
            {...props!}
            disabled={props.disabled || props.readOnly}
            className={classNames({ "opacity-100": props.readOnly })}
            dropdownIcon={props.loading ? "pi pi-spin pi-spinner" : !props.readOnly ? "pi pi-chevron-down" : ""}
        />
    );
}