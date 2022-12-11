import React from "react";
import classNames from "classnames";

import {
    AutoComplete as AutoCompletePrime,
    AutoCompleteProps as AutoCompletePrimeProps
} from "primereact/autocomplete";

export interface AutoCompleteProps extends AutoCompletePrimeProps {
    loading?: boolean;
}

export function AutoComplete(props: AutoCompleteProps) {
    return (
        <AutoCompletePrime
            {...props}
            dropdown={!props.readOnly && props.dropdown}
            dropdownIcon={props.loading ? "pi pi-spin pi-spinner" : "pi pi-chevron-down"}
            disabled={props.disabled || props.loading || props.readOnly}
            inputClassName={classNames(props.inputClassName, { "opacity-100": props.readOnly })}
        />
    );
}
