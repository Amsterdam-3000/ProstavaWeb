import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router";
import { Prostava } from "../../app/services";

import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "../prime/Avatar";

export interface ProstavaParticipantsGroupProps {
    prostava: Prostava;
    className?: string;
}

export function ProstavaParticipantsGroup(props: ProstavaParticipantsGroupProps) {
    const history = useHistory();

    return (
        <AvatarGroup className={classNames("prostava-participants max-w-min", props.className)}>
            {props.prostava.participants
                ?.filter((participant) => participant.rating > 0)
                .map((participant) => (
                    <Avatar
                        key={`${props.prostava.id}-${participant.user.id}`}
                        shape="circle"
                        image={participant.user.photo}
                        imageAlt={participant.user.name}
                        imageHasBackground
                        tooltip={`${participant.user.name}: ${participant.rating.toFixed(0)}`}
                        tooltipPosition="bottom"
                        onClick={(e) => {
                            history.push(`${history.location.pathname}/profile/${participant.user.id}`);
                        }}
                    />
                ))}
        </AvatarGroup>
    );
}
