import React from "react";
import classNames from "classnames";
import { useController, useFormContext } from "react-hook-form";
import { localeOption } from "primereact/api";

import { InputText, InputTextProps } from "../prime/InputText";

export interface InputNameProps extends InputTextProps {
    name: string;
}

export function InputName(props: InputNameProps) {
    const { setValue } = useFormContext();

    const t = localeOption("form")[props.name];

    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            required: props.required && t && t["isRequired"],
            pattern: {
                value: /^\p{L}.*$/u,
                message: t && t["mustStartLetter"]
            }
        }
    });

    if (field.value === undefined) {
        return null;
    }

    return (
        <InputText
            {...props}
            value={field.value}
            onChange={(e) => {
                //TODO WTF?
                setValue(field.name, e.target.value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
                //field.onChange(e.target.value);
            }}
            className={classNames(props.className, {
                "p-invalid": fieldState.invalid
            })}
        />
    );
}
