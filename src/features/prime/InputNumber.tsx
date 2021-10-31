import React from "react";
import classNames from "classnames";

import { InputNumber as InputNumberPrime, InputNumberProps } from "primereact/inputnumber";

export function InputNumber(props: InputNumberProps) {
    return (
        <InputNumberPrime
            {...props!}
            disabled={props.disabled || props.readOnly}
            inputClassName={classNames(props.inputClassName, { "opacity-100": props.readOnly })}
            showButtons={props.readOnly ? false : props.showButtons}
        />
    );
}
