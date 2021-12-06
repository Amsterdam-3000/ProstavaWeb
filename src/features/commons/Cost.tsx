import React from "react";
import classNames from "classnames";

export interface CostTextProps {
    amount: number;
    currency: string;
    className?: string;
}

export function CostText(props: CostTextProps) {
    return (
        <span className={classNames(props.className)}>
            {props.currency && props.amount && props.currency + props.amount}
        </span>
    );
}
