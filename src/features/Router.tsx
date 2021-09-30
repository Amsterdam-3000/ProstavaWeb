import React from "react";

import { Route, Switch } from "react-router";
// import { PrivateRoute } from "./utils/PrivateRoute";

import { EmptyPage } from "../features/EmptyPage";
import { Exception } from "./exception/Exception";

export function Router() {
    return (
        <Switch>
            <Route path="*/asdfg" component={EmptyPage} />
            <Route
                path="*/zxc"
                render={() => <Exception title="NOT FOUND" detail="Requested resource is not available" />}
            />
        </Switch>
    );
}
