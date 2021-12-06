import React from "react";
import classNames from "classnames";
import { BaseObject } from "../../app/services";

export interface VenueLinkProps {
    venue: BaseObject;
    small?: boolean;
    address?: string;
    className?: string;
}

export function VenueLink(props: VenueLinkProps) {
    return (
        <a href={props.venue.link} target="_blank" rel="noreferrer" className={classNames(props.className)}>
            <span className="block">{props.venue.name}</span>
            {props.address ? <span className="block">{props.address}</span> : null}
        </a>
    );
}
