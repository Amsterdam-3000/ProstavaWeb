import React from "react";
import classNames from "classnames";

import { Button, ButtonProps } from "primereact/button";
import { Chip, ChipProps } from "./Chip";

export interface ChipButtonProps extends ChipProps, Omit<Omit<ButtonProps, "icon">, "style"> {
    chipClassName?: string;
}

export function ChipButton(props: ChipButtonProps) {
    const { imageAlt, imageHasBackground, ...buttonProps } = { ...props };
    return (
        <Button
            {...buttonProps}
            icon=""
            label=""
            loading={false}
            className={classNames(props.className, "p-0 p-button-chip surface-d", {
                "p-button-rounded": props.shape === "circle"
            })}
        >
            <Chip {...props} className={props.chipClassName} />
        </Button>
    );
}
