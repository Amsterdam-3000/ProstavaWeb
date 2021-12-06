import React from "react";
import classNames from "classnames";

import { Prostava, ProstavaStatus } from "../../app/services";

import { Card } from "primereact/card";
import { Avatar } from "../prime/Avatar";
import { ProfileButton } from "../profile/ProfileButton";
import { DateText, TimeText } from "../commons/DateTime";
import { CostText } from "../commons/Cost";
import { VenueLink } from "../commons/Venue";
import { ProstavaRating } from "./ProstavaRating";
import { ProstavaStatusTag } from "./ProstavaStatusTag";
import { ProstavaParticipantsGroup } from "./ProstavaParticipantsGroup";

export interface ProstavaCardProps {
    prostava: Prostava;
    className?: string;
}

export function ProstavaCard(props: ProstavaCardProps) {
    const headerTemplate = (
        <div className="flex flex-column relative">
            {props.prostava.venue.photo ? (
                <a href={props.prostava.venue.link} target="_blank" rel="noreferrer">
                    <img
                        src={props.prostava.venue.photo}
                        alt={props.prostava.venue.name}
                        className="border-round-top -mb-2"
                    />
                </a>
            ) : null}
            <Avatar
                image={props.prostava.photo}
                imageAlt={props.prostava.name}
                shape="circle"
                size="xlarge"
                imageHasBackground
                className={classNames("shadow-4 ml-2 mt-2", {
                    "-mt-5": props.prostava.venue.photo
                })}
            />
            <ProstavaStatusTag
                status={props.prostava.status}
                className={classNames("absolute right-0 mr-2 mt-2", {
                    "bottom-0": props.prostava.venue.photo
                })}
            />
        </div>
    );

    const subTitleTemplate =
        props.prostava.status !== ProstavaStatus.Rejected ? (
            <div className="flex flex-column">
                <div className="flex justify-content-between mb-1">
                    <DateText date={props.prostava.date} />
                    <span>
                        {props.prostava.is_preview ? (
                            <TimeText time={props.prostava.date} timeZone={props.prostava.timezone} />
                        ) : (
                            <CostText amount={props.prostava.amount!} currency={props.prostava.currency!} />
                        )}
                    </span>
                </div>
                <VenueLink venue={props.prostava.venue} address={props.prostava.venue.address} className="text-sm" />
            </div>
        ) : null;

    const footerTemplate =
        props.prostava.status === ProstavaStatus.Approved ? (
            <div className="flex justify-content-center">
                <ProstavaRating rating={props.prostava.rating} readOnly />
            </div>
        ) : null;

    return (
        <Card
            header={headerTemplate}
            title={props.prostava.name}
            subTitle={subTitleTemplate}
            footer={footerTemplate}
            className={classNames(props.className, "border-1 border-d")}
        >
            <ProfileButton profile={props.prostava.author} className="mb-2" tooltip="Author" />
            <ProstavaParticipantsGroup prostava={props.prostava} />
        </Card>
    );
}
