import React from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { ProstavaStatus } from "../../app/services";

import { Tag, TagSeverityType } from "primereact/tag";

export interface ProstavaStatusTagProps {
    status: ProstavaStatus;
    className?: string;
}

export function ProstavaStatusTag(props: ProstavaStatusTagProps) {
    return (
        <Tag
            value={localeOption("status")[props.status]}
            icon={convertProstavaStatusToIcon(props.status)}
            severity={convertProstavaStatusToSeverity(props.status)}
            rounded
            className={classNames(props.className)}
        />
    );
}

function convertProstavaStatusToSeverity(status: ProstavaStatus): TagSeverityType {
    switch (status) {
        case ProstavaStatus.Pending:
            return "warning";
        case ProstavaStatus.Approved:
            return "success";
        case ProstavaStatus.Rejected:
            return "danger";
        default:
            return "info";
    }
}

function convertProstavaStatusToIcon(status: ProstavaStatus): string {
    switch (status) {
        case ProstavaStatus.Pending:
            return "pi pi-clock";
        case ProstavaStatus.Approved:
            return "pi pi-check-circle";
        case ProstavaStatus.Rejected:
            return "pi pi-times-circle";
        default:
            return "pi pi-info-circle";
    }
}
