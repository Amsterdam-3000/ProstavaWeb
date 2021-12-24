import React from "react";
import classNames from "classnames";
import { ProstavaVenue } from "../../app/services";

export interface ProstavaVenueItemProps {
    venue: ProstavaVenue;
    className?: string;
}

export function ProstavaVenueItem(props: ProstavaVenueItemProps) {
    return (
        <div className="flex">
            <img alt={props.venue.name} src={props.venue.photo} className="mr-2" style={{ height: "3.5rem" }} />
            <div className="flex flex-column justify-content-center">
                <span className={classNames({ "mb-2": props.venue.address })}>{props.venue.name}</span>
                <small>{props.venue.address}</small>
            </div>
        </div>
    );
}
