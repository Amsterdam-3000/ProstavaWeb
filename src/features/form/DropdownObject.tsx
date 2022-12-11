import React from "react";
import classNames from "classnames";
import { useController, useFormContext } from "react-hook-form";
import { localeOption } from "primereact/api";
import { BaseObject } from "../../app/services";

import { Dropdown, DropdownProps } from "../prime/Dropdown";

export interface DropdownObjectProps extends DropdownProps {
    name: string;
    isObject?: boolean;
    hideName?: boolean;
    showPhoto?: boolean;
}

export function DropdownObject(props: DropdownObjectProps) {
    const t = localeOption("form")[props.name];

    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            required: !props.isObject && props.required && t && t["isRequired"],
            validate: (object: BaseObject) =>
                props.isObject && !object.name && props.required && t ? t["isRequired"] : true
        }
    });
    const { setValue } = useFormContext<BaseObject>();

    const itemTemplate = (object: BaseObject) => {
        return (
            <div className="flex">
                <img alt={object?.name} src={object?.photo} className="mr-1" style={{ height: "1.25rem" }} />
                <span>{object?.name}</span>
            </div>
        );
    };

    const valueTemplate = (object: BaseObject) => {
        return props.hideName ? (
            <div className="flex">
                <img alt={object?.name} src={object?.photo} style={{ height: "1.25rem" }} />
            </div>
        ) : (
            itemTemplate(object)
        );
    };

    return (
        <Dropdown
            {...props}
            value={props.isObject ? field.value : { id: field.value }}
            onChange={(e) => {
                field.onChange(props.isObject ? e.value : (e.value as BaseObject).id);
                if (!props.isObject && field.name === "emoji") {
                    setValue("photo", (e.value as BaseObject).photo);
                }
            }}
            dataKey="id"
            optionLabel="name"
            valueTemplate={props.showPhoto && valueTemplate}
            itemTemplate={props.showPhoto && itemTemplate}
            className={classNames(props.className, {
                "p-invalid": fieldState.invalid
            })}
        />
    );
}
