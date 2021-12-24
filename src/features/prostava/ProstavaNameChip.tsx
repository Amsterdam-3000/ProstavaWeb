import React from "react";
import classNames from "classnames";
import { Prostava } from "../../app/services";

import { Tooltip } from "primereact/tooltip";
import { Chip } from "../prime/Chip";

export interface ProstavaNameChipProps {
    prostava: Prostava;
    className?: string;
}

export function ProstavaNameChip(props: ProstavaNameChipProps) {
    return (
        <React.Fragment>
            <Tooltip
                target={`.prostava-name-chip-${props.prostava.id}`}
                content={props.prostava.name}
                position="right"
            />
            <Chip
                image={props.prostava.photo}
                imageAlt={props.prostava.name}
                label={props.prostava.name}
                shape="square"
                className={classNames(`prostava-name-chip-${props.prostava.id}`, "bg-transparent", props.className)}
            />
        </React.Fragment>
    );
}
