import React from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { ProstavaStatus } from "../../app/services";

import { Tag } from "primereact/tag";

export interface ProstavaStatusTagProps {
    status: ProstavaStatus;
    className?: string;
}

export function ProstavaStatusTag(props: ProstavaStatusTagProps) {
    return (
        <Tag
            value={localeOption("status")[props.status]}
            icon={props.status === ProstavaStatus.Approved ? "pi pi-check-circle" : "pi pi-times-circle"}
            severity={props.status === ProstavaStatus.Approved ? "success" : "danger"}
            rounded
            className={classNames(props.className)}
        />
    );
}
