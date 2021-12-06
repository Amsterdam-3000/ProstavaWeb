import React, { useEffect } from "react";
import { useHistory } from "react-router";

import { Reminders } from "../prostava/Reminders";
import { Profiles } from "../profile/Profiles";

export function Dashboard() {
    const history = useHistory();

    //Delete '/' from end of the url
    useEffect(() => {
        if (history.location.pathname.endsWith("/")) {
            history.replace(history.location.pathname.replace(/\/$/, ""));
        }
    }, [history]);

    return (
        <div className="grid m-0">
            <div className="col-12 sm:col-12 md:col-7 lg:col-7 xl:col-5">
                <Reminders/>
            </div>
            <div className="col-12 sm:col-12 md:col-5 lg:col-5 xl:col-3">
                <Profiles />
            </div>
        </div>
    );
}
