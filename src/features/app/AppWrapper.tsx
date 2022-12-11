import React from "react";
import PrimeReact, { locale, localeOption } from "primereact/api";
import { useAppSelector } from "../../hooks/store";
import { selectStorageLanguage } from "../app/appSlice";

import { Redirect, Route, Switch } from "react-router";
import { PrivateRouteApp } from "../auth/PrivateRouteApp";
import { App } from "../app/App";
import { WebApp } from "../webapp/WebApp";
import { Login } from "../auth/Login";
import { Exception } from "../pages/Exception";
import { PrivateRouteWebApp } from "../auth/PrivateRouteWebApp";

export function AppWrapper() {
    const language = useAppSelector(selectStorageLanguage);

    PrimeReact.ripple = true;
    locale(language);

    return (
        <Switch>
            <PrivateRouteApp exact path="/" render={() => <Redirect to={{ pathname: "/app" }} />} />
            <PrivateRouteApp
                path={[
                    "/app/:groupId/*prostava/:prostavaId",
                    "/app/:groupId/*profile/:userId",
                    "/app/:groupId",
                    "/app"
                ]}
                component={App}
            />
            <PrivateRouteWebApp path="/webapp" component={WebApp} />
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
