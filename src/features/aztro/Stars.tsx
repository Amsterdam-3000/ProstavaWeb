import React from "react";
import classNames from "classnames";

export interface StarsProps {
    className?: string;
}

export function Stars(props: StarsProps) {
    return (
        <div className={classNames("parallax-stars", props.className)}>
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
        </div>
    );
}
