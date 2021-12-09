import React from "react";
import { useController } from "react-hook-form";

import { InputSlider, InputSliderProps } from "../prime/InputSlider";

export interface InputNumberSliderProps extends InputSliderProps {
    name: string;
}

export function InputNumberSlider(props: InputNumberSliderProps) {
    const { field } = useController({ name: props.name });

    return (
        <InputSlider
            {...props}
            value={field.value}
            onChange={(e) => {
                field.onChange(e.value);
            }}
            allowEmpty={false}
        />
    );
}
