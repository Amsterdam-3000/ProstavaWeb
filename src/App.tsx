import React from "react";
import { Route, Switch } from "react-router";

import "./App.scss";
import { Login } from "./features/auth/Login";
import { NotFound } from "./features/others/NotFound";
import { EmptyPage } from "./features/others/EmptyPage";
import { PrivateRoute } from "./utils/PrivateRoute";

function App() {
    return (
        <Switch>
            <PrivateRoute exact path="/" component={EmptyPage}/>
            <Route path="/login" component={Login} />
            <Route path="*" component={NotFound} />
        </Switch>
    );
}

export default App;
