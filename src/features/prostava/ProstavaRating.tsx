import React from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";

import { Rating, RatingChangeParams } from "primereact/rating";
import { SelectButton } from "primereact/selectbutton";

export interface ProstavaRatingProps {
    rating: number;
    readOnly?: boolean;
    disabled?: boolean;
    isRequest?: boolean;
    onChange?(e: RatingChangeParams): void;
    className?: string;
}

export function ProstavaRating(props: ProstavaRatingProps) {
    return props.isRequest ? (
        <SelectButton
            value={props.rating}
            options={[
                { icon: "pi pi-check", name: localeOption("accept"), value: 1 },
                { icon: "pi pi-times", name: localeOption("reject"), value: 0 }
            ]}
            optionLabel="name"
        />
    ) : (
        <Rating
            value={props.rating}
            cancel={!props.readOnly}
            readOnly={props.readOnly}
            disabled={props.disabled}
            tooltip={`${localeOption("prostava")["rating"]}: ${props.rating.toFixed(1)}`}
            tooltipOptions={{ position: "bottom" }}
            onChange={props.onChange}
            className={classNames(props.className)}
        />
    );
}
