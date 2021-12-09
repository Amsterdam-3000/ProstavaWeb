import React from "react";
import classNames from "classnames";

import { useHistory } from "react-router";
import { BaseObject } from "../../app/services";

import { ChipButton } from "../prime/ChipButton";

export interface ProfileButtonProps {
    profile: BaseObject;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    tooltip?: string;
}

export function ProfileButton(props: ProfileButtonProps) {
    const history = useHistory();

    return (
        <ChipButton
            image={props.profile.photo}
            imageAlt={props.profile.name}
            imageHasBackground
            label={props.profile.name}
            shape="circle"
            tooltip={props.tooltip || props.profile.name}
            tooltipOptions={{ position: "bottom" }}
            disabled={props.disabled}
            loading={props.loading}
            onClick={(e) => {
                history.push(`${history.location.pathname}/profile/${props.profile.id}`);
            }}
            className={classNames(props.className, "max-w-full", { "border-d": !props.className?.includes("border-") })}
        />
    );
}
