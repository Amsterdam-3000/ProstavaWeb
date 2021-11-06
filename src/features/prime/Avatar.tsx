import React from "react";
import classNames from "classnames";

import { Avatar as AvatarPrime, AvatarProps as AvatarPrimeProps } from "primereact/avatar";

export interface AvatarProps extends AvatarPrimeProps {
    disabled?: boolean;
    loading?: boolean;
}

export function Avatar(props: AvatarProps) {
    return (
        <AvatarPrime
            {...props!}
            className={classNames(props.className, { "opacity-100": props.disabled })}
            icon={props.loading ? "pi pi-spin pi-spinner" : props.icon}
        />
    );
}
