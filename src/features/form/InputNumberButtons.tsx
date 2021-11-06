import React from "react";

import { useController } from "react-hook-form";

import { InputNumber, InputNumberProps } from "../prime/InputNumber";

export interface InputNumberButtonsProps extends InputNumberProps {
    name: string;
}

export function InputNumberButtons(props: InputNumberButtonsProps) {
    const { field } = useController({ name: props.name });

    return (
        <InputNumber
            {...props}
            value={field.value}
            onChange={(e) => {
                field.onChange(e.value);
            }}
            allowEmpty={false}
            showButtons
            incrementButtonClassName="p-button-outlined"
            decrementButtonClassName="p-button-outlined"
        />
    );
}
