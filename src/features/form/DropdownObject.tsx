import React from "react";

import { useController } from "react-hook-form";
import { BaseObject } from "../../app/services/base";

import { Dropdown, DropdownProps } from "../prime/Dropdown";

export interface DropdownObjectProps extends DropdownProps {
    name: string;
    showPhoto?: boolean;
}

export function DropdownObject(props: DropdownObjectProps) {
    const { field } = useController({ name: props.name });

    const objectTemplate = (object: BaseObject) => {
        return (
            <div className="flex">
                <img alt={object?.name} src={object?.photo} className="mr-1" style={{ height: "1.25rem" }} />
                <span>{object?.name}</span>
            </div>
        );
    };

    return (
        <Dropdown
            {...props}
            value={{ id: field.value }}
            onChange={(e) => {
                field.onChange((e.value as BaseObject).id);
            }}
            dataKey="id"
            optionLabel="name"
            valueTemplate={props.showPhoto && objectTemplate}
            itemTemplate={props.showPhoto && objectTemplate}
        />
    );
}
