import React from "react";
import { Route, Switch } from "react-router";

import "./App.scss";
import { Login } from "./features/login/Login";
import { NotFound } from "./features/others/NotFound";

function App() {
    return (
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="*" component={NotFound} />
        </Switch>
    );
}

export default App;
