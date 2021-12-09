import React from "react";
import classNames from "classnames";

import {
    Avatar as AvatarPrime,
    AvatarProps as AvatarPrimeProps,
    AvatarSizeType as AvatarPrimeSizeType
} from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";
import { TooltipPositionType } from "primereact/tooltip/tooltipoptions";

export type AvatarSizeType = AvatarPrimeSizeType | "small";

export interface AvatarProps extends Omit<Omit<AvatarPrimeProps, "template">, "size"> {
    disabled?: boolean;
    loading?: boolean;
    imageClassName?: string;
    imageHasBackground?: boolean;
    size?: AvatarSizeType;
    edit?: boolean;
    editIcon?: string;
    tooltip?: string;
    tooltipPosition?: TooltipPositionType;
}

let id = 0;

export function Avatar(props: AvatarProps) {
    id++;

    return (
        <React.Fragment>
            {props.tooltip && (
                <Tooltip target={`.avatar-${id}`} content={props.tooltip} position={props.tooltipPosition} />
            )}
            <AvatarPrime
                {...props!}
                size={props.size === "small" ? "normal" : props.size}
                className={classNames(`avatar-${id}`, props.className, {
                    "p-disabled": props.disabled || props.loading,
                    "p-avatar-sm": props.size === "small",
                    "p-avatar-image-background": props.image && props.imageHasBackground,
                    "p-image-preview-container": props.edit && !props.disabled && !props.loading
                })}
                icon={props.loading ? "pi pi-spin pi-spinner" : props.icon}
                template={(props: AvatarProps) => {
                    if (props.label) {
                        return <span className="p-avatar-text">{props.label}</span>;
                    }
                    if (props.icon) {
                        return <span className={classNames("p-avatar-icon", props.icon)} />;
                    }
                    if (props.image) {
                        return (
                            <React.Fragment>
                                <img
                                    src={props.image}
                                    alt={props.imageAlt}
                                    className={classNames(props.imageClassName, {
                                        "border-noround": props.imageHasBackground,
                                        "border-round": !props.imageHasBackground && props.shape === "square",
                                        "border-circle": !props.imageHasBackground && props.shape === "circle"
                                    })}
                                />
                                {props.edit && !props.disabled && !props.loading ? (
                                    <div className="p-image-preview-indicator text-white">
                                        <i
                                            className={classNames(
                                                "p-image-preview-icon",
                                                props.editIcon || "pi pi-user-edit"
                                            )}
                                        ></i>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        );
                    }
                    return null;
                }}
            />
        </React.Fragment>
    );
}
