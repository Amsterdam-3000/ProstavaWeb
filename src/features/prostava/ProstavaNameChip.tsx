import React from "react";
import classNames from "classnames";

import { Prostava } from "../../app/services";

import { Chip } from "../prime/Chip";

export interface ProstavaNameChipProps {
    prostava: Prostava;
    className?: string;
}

export function ProstavaNameChip(props: ProstavaNameChipProps) {
    return (
        <Chip
            image={props.prostava.photo}
            imageAlt={props.prostava.name}
            label={props.prostava.name}
            shape="square"
            className={classNames("transparent", props.className)}
        />
    );
}
