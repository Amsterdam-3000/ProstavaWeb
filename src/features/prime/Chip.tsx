import React from "react";
import classNames from "classnames";

import { Chip as ChipPrime, ChipProps as ChipPrimeProps } from "primereact/chip";
import { AvatarShapeType } from "primereact/avatar";
import { Avatar, AvatarSizeType } from "./Avatar";

export interface ChipProps extends Omit<ChipPrimeProps, "template"> {
    disabled?: boolean;
    loading?: boolean;
    imageClassName?: string;
    imageHasBackground?: boolean;
    avatarClassName?: string;
    size?: AvatarSizeType;
    shape?: AvatarShapeType;
}

export function Chip(props: ChipProps) {
    return (
        <ChipPrime
            {...props!}
            className={classNames(props.className, "max-w-full", {
                "p-disabled": props.disabled || props.loading,
                "p-chip-sm": props.size === "small",
                "p-chip-lg": props.size === "large",
                "p-chip-xl": props.size === "xlarge",
                "border-round": props.shape === "square"
            })}
            icon={props.loading ? "pi pi-spin pi-spinner" : props.icon}
            template={(props: ChipProps) => {
                return (
                    <React.Fragment>
                        <Avatar
                            image={props.image}
                            imageAlt={props.imageAlt}
                            imageClassName={props.imageClassName}
                            className={classNames(props.avatarClassName, "-ml-2 mr-2")}
                            shape={props.shape ? props.shape : "circle"}
                            icon={props.icon && classNames(props.icon, "p-chip-icon")}
                            imageHasBackground={props.imageHasBackground}
                            loading={props.loading}
                            disabled={props.disabled}
                            size={props.size}
                        />
                        <span
                            className={classNames("p-chip-text h-full overflow-hidden text-overflow-ellipsis", {
                                "text-xs": props.size === "small",
                                "text-2xl": props.size === "large",
                                "text-4xl": props.size === "xlarge",
                                "white-space-nowrap": props.imageHasBackground || props.shape === "circle"
                            })}
                        >
                            {props.label}
                        </span>
                    </React.Fragment>
                );
            }}
        />
    );
}
