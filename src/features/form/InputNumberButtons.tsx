import React from "react";
import classNames from "classnames";
import { localeOption } from "primereact/api";
import { useController } from "react-hook-form";

import { InputNumber, InputNumberProps } from "../prime/InputNumber";

export interface InputNumberButtonsProps extends InputNumberProps {
    name: string;
}

export function InputNumberButtons(props: InputNumberButtonsProps) {
    const t = localeOption("form")[props.name];

    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            required: props.required && t && t["isRequired"]
        }
    });

    return (
        <InputNumber
            {...props}
            value={field.value}
            onChange={(e) => {
                field.onChange(e.value);
            }}
            showButtons
            incrementButtonClassName="p-button-outlined"
            decrementButtonClassName="p-button-outlined"
            className={classNames(props.className, {
                "p-invalid": fieldState.invalid
            })}
        />
    );
}
