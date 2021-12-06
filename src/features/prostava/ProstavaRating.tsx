import React from "react";
import classNames from "classnames";

import { Rating, RatingChangeParams } from "primereact/rating";

export interface ProstavaRatingProps {
    rating: number;
    readOnly?: boolean;
    onChange?(e: RatingChangeParams): void;
    className?: string;
}

export function ProstavaRating(props: ProstavaRatingProps) {
    return (
        <Rating
            value={props.rating}
            cancel={!props.readOnly}
            readOnly={props.readOnly}
            tooltip={`Rating: ${props.rating.toString()}`}
            tooltipOptions={{ position: "left" }}
            onChange={props.onChange}
            className={classNames(props.className)}
        />
    );
}
