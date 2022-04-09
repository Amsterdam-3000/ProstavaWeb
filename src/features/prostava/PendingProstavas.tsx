import React from "react";
import classNames from "classnames";
import { useAppSelector } from "../../hooks/store";
import { useGetPendingProstavasQuery } from "../../app/services/prostava";
import { selectStorageGroupId } from "../app/appSlice";

import { Carousel } from "primereact/carousel";
import { ProstavaCard } from "./ProstavaCard";

export interface PendingProstavasProps {
    className?: string;
}

export function PendingProstavas(props: PendingProstavasProps) {
    const groupId = useAppSelector(selectStorageGroupId);

    const { data: pendingProstavas } = useGetPendingProstavasQuery(groupId!);

    return (
        <Carousel
            value={pendingProstavas}
            itemTemplate={(prostava) => <ProstavaCard prostava={prostava} />}
            className={classNames({
                "p-carousel-one-item": pendingProstavas?.length === 1
            })}
        />
    );
}
