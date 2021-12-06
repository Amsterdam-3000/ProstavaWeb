import React from "react";
import classNames from "classnames";

import { BaseObject } from "../../app/services";

import { Chip } from "../prime/Chip";

export interface ProfileChipProps {
    profile: BaseObject;
    className?: string;
}

export function ProfileChip(props: ProfileChipProps) {
    return (
        <Chip
            image={props.profile.photo}
            imageAlt={props.profile.name}
            imageHasBackground
            label={props.profile.name}
            shape="circle"
            className={classNames(props.className)}
        />
    );
}
