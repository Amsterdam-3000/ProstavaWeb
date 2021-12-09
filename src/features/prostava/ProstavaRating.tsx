import React from "react";
import { localeOption } from "primereact/api";
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
            tooltip={`${localeOption("prostava")["rating"]}: ${props.rating.toFixed(1)}`}
            tooltipOptions={{ position: "bottom" }}
            onChange={props.onChange}
            className={classNames(props.className)}
        />
    );
}
