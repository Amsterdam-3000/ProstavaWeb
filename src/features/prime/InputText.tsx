import React from "react";
import classNames from "classnames";

import { InputText as InputTextPrime, InputTextProps as InputTextPrimeProps } from "primereact/inputtext";

export interface InputTextProps extends InputTextPrimeProps {}

export function InputText(props: InputTextProps) {
    const { ref, ...others } = { ...props };

    return (
        <InputTextPrime
            {...others}
            disabled={props.disabled || props.readOnly}
            className={classNames(props.className, { "opacity-100": props.readOnly })}
        />
    );
}
