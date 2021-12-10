import React from "react";
import classNames from "classnames";

import romanFace from "../../assets/images/roman.png";

export interface RomanProps {
    className?: string;
}

export function Roman(props: RomanProps) {
    return (
        <div className={classNames("roman", props.className)}>
            <div className="astronaut x">
                <div className="y">
                    <img src={romanFace} alt="roman-face" />
                </div>
            </div>
            <div className="black-hole"></div>
        </div>
    );
}
