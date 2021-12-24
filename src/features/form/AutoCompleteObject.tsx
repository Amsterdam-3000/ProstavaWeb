import React, { useState } from "react";
import classNames from "classnames";
import { useController } from "react-hook-form";
import { localeOption } from "primereact/api";
import { BaseObject } from "../../app/services";

import { AutoComplete, AutoCompleteProps } from "../prime/AutoComplete";

export interface AutoCompleteObjectProps extends Omit<AutoCompleteProps, "name"> {
    name: string;
    isObject?: boolean;
    required?: boolean;
}

export function AutoCompleteObject(props: AutoCompleteObjectProps) {
    const t = localeOption("form")[props.name];

    const [objects, setObjects] = useState(props.suggestions);

    const { field, fieldState } = useController({
        name: props.name,
        rules: {
            validate: (object: BaseObject) =>
                props.isObject && !object.name && props.required && t ? t["isRequired"] : true
        }
    });

    const itemTemplate = (object: BaseObject) => {
        return (
            <div className="flex">
                <img alt={object?.name} src={object?.photo} className="mr-1" style={{ height: "1.25rem" }} />
                <span>{object?.name}</span>
            </div>
        );
    };

    return (
        <AutoComplete
            {...props}
            value={props.isObject ? (field.value as BaseObject).name : field.value}
            suggestions={objects}
            completeMethod={(e) => {
                setObjects(
                    props.suggestions?.filter((object: BaseObject) => new RegExp(e.query, "i").test(object.name))
                );
            }}
            onChange={(e) => {
                field.onChange(props.isObject ? { ...field.value, name: e.value } : e.value);
            }}
            onSelect={(e) => {
                field.onChange(props.isObject ? e.value : (e.value as BaseObject).name);
            }}
            field="name"
            dropdown
            className={classNames(props.className, {
                "p-invalid": fieldState.invalid
            })}
            itemTemplate={props.itemTemplate || itemTemplate}
        />
    );
}
