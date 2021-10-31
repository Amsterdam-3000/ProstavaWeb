import React from "react";
import PrimeReact from "primereact/api";

import { Redirect, Route, Switch } from "react-router";
import { PrivateRoute } from "../auth/PrivateRoute";
import { App } from "../app/App";
import { Login } from "../auth/Login";
import { Exception } from "../pages/Exception";

export function AppWrapper() {
    PrimeReact.ripple = true;

    return (
        <Switch>
            <PrivateRoute exact path="/" render={() => <Redirect to={{ pathname: "/app" }} />} />
            <PrivateRoute path={["/app/:groupId", "/app"]} component={App} />
            <Route path="/login" component={Login} />
            <Route
                path="*"
                render={() => <Exception title="NOT FOUND" detail="Requested resource is not available" />}
            /> 
        </Switch>
    );
}
