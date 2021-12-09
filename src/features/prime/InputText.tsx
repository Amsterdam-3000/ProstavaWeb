import React from "react";
import classNames from "classnames";

import { InputText as InputTextPrime, InputTextProps as InputTextPrimeProps } from "primereact/inputtext";

export interface InputTextProps extends InputTextPrimeProps {}

export function InputText(props: InputTextProps) {
    return (
        <InputTextPrime
            {...props}
            disabled={props.disabled || props.readOnly}
            className={classNames(props.className, { "p-disabled": props.readOnly })}
        />
    );
}
