import React from "react";
import classNames from "classnames";

import { useHistory } from "react-router";
import { BaseObject } from "../../app/services";

import TooltipOptions from "primereact/tooltip/tooltipoptions";
import { ChipButton } from "../prime/ChipButton";

export interface ProfileButtonProps {
    profile: BaseObject;
    tooltip?: string;
    tooltipOptions?: TooltipOptions;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
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
            tooltip={props.tooltip}
            tooltipOptions={props.tooltipOptions}
            disabled={props.disabled}
            loading={props.loading}
            onClick={(e) => {
                history.push(`${history.location.pathname}/profile/${props.profile.id}`);
            }}
            className={classNames(props.className, { "border-d": !props.className?.includes("border-") })}
        />
    );
}
