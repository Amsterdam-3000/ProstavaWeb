import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useGetPendingProstavasQuery } from "../../app/services/prostava";
import { useAppSelector } from "../../hooks/store";
import { selectStorageGroupId } from "../app/appSlice";

import { Reminders } from "../prostava/Reminders";
import { PendingProstavas } from "../prostava/PendingProstavas";
import { Profiles } from "../profile/Profiles";

export function Dashboard() {
    const history = useHistory();
    const groupId = useAppSelector(selectStorageGroupId);

    const { data: pendingProstavas } = useGetPendingProstavasQuery(groupId!);

    //Delete '/' from end of the url
    useEffect(() => {
        if (history.location.pathname.endsWith("/")) {
            history.replace(history.location.pathname.replace(/\/$/, ""));
        }
    }, [history]);

    //TODO hide when no data
    return (
        <div className="grid m-0">
            {pendingProstavas?.length ? (
                <div className="col-12 sm:col-12 md:col-5 lg:col-5 xl:col-3">
                    <PendingProstavas />
                </div>
            ) : null}
            <div className="col-12 sm:col-12 md:col-7 lg:col-7 xl:col-5">
                <Reminders />
            </div>
            <div className="col-12 sm:col-12 md:col-5 lg:col-5 xl:col-3">
                <Profiles />
            </div>
        </div>
    );
}
