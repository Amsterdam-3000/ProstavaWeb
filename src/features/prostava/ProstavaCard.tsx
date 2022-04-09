import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { api, Prostava, ProstavaStatus } from "../../app/services";
import { useAppSelector } from "../../hooks/store";
import { selectStorageGroupId } from "../app/appSlice";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
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
    const history = useHistory();
    const groupId = useAppSelector(selectStorageGroupId);

    const [
        withdrawProstava,
        { isLoading: isProstavaWithdrawing, isSuccess: isProstavaWithdrawSuccess, isError: isProstavaWithdrawError }
    ] = api.useWithdrawProstavaMutation();

    const t = localeOption("prostava");

    // Show message when failed
    useEffect(() => {
        if (isProstavaWithdrawError) {
            history.push(history.location.pathname, {
                message: {
                    severity: "error",
                    summary: localeOption("prostava")["notWithdrawed"],
                    detail: localeOption("prostava")["withdrawFail"]
                }
            });
        }
    }, [isProstavaWithdrawError, history]);
    // Show Prostava dialog when success
    useEffect(() => {
        if (isProstavaWithdrawSuccess) {
            history.push(`${history.location.pathname}/prostava/${props.prostava.id}`);
        }
    }, [isProstavaWithdrawSuccess, history, props.prostava]);

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
        props.prostava.status === ProstavaStatus.Approved || props.prostava.status === ProstavaStatus.Pending ? (
            <div className="flex flex-column align-items-center">
                <ProstavaRating
                    rating={props.prostava.rating}
                    isRequest={props.prostava.is_request}
                    readOnly={!props.prostava.canRate}
                    disabled={isProstavaWithdrawing}
                />
                {props.prostava.canWithdraw ? (
                    <Button
                        icon="pi pi-undo"
                        className="mt-3"
                        label={t["withdraw"]}
                        onClick={() => {
                            withdrawProstava({ groupId: groupId!, prostavaId: props.prostava.id });
                        }}
                        loading={isProstavaWithdrawing}
                    />
                ) : null}
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
            <ProfileButton profile={props.prostava.author} className="mb-2" />
            <ProstavaParticipantsGroup prostava={props.prostava} />
        </Card>
    );
}
