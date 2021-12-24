import React from "react";
import PrimeReact, { locale, localeOption } from "primereact/api";
import { useAppSelector } from "../../hooks/store";
import { selectStorageLanguage } from "../app/appSlice";

import { Redirect, Route, Switch } from "react-router";
import { PrivateRoute } from "../auth/PrivateRoute";
import { App } from "../app/App";
import { Login } from "../auth/Login";
import { Exception } from "../pages/Exception";

export function AppWrapper() {
    const language = useAppSelector(selectStorageLanguage);

    PrimeReact.ripple = true;
    locale(language);

    return (
        <Switch>
            <PrivateRoute exact path="/" render={() => <Redirect to={{ pathname: "/app" }} />} />
            <PrivateRoute
                path={[
                    "/app/:groupId/*prostava/:prostavaId",
                    "/app/:groupId/*profile/:userId",
                    "/app/:groupId",
                    "/app"
                ]}
                component={App}
            />
            <Route path="/login" component={Login} />
            <Route
                path="*"
                render={() => (
                    <Exception
                        title={localeOption("app")["notFound"]}
                        detail={localeOption("app")["notAvailable"]}
                        severity="info"
                    />
                )}
            />
        </Switch>
    );
}
