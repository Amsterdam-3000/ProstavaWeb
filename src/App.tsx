import React from "react";
import PrimeReact from "primereact/api";

import { Route, Switch } from "react-router";
import { PrivateRoute } from "./utils/PrivateRoute";

import { Login } from "./features/auth/Login";
import { Exception } from "./features/exception/Exception";
import { EmptyPage } from "./features/EmptyPage";

import "./App.scss";

function App() {
    PrimeReact.ripple = true;

    return (
        <Switch>
            <PrivateRoute exact path="/" component={EmptyPage} />
            <Route path="/login" component={Login} />
            <Route
                path="*"
                render={() => <Exception title="NOT FOUND" detail="Requested resource is not available" />}
            />
        </Switch>
    );
}

export default App;
