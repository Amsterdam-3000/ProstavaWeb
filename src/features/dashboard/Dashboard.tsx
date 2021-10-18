import React from "react";

import { Route, Switch } from "react-router";

export function Dashboard() {
    return (
        <div>
            <div>Test</div>
            <Switch>
                <Route path="*/1">
                    <div>1</div>
                </Route>
                <Route path="*/2">
                    <div>2</div>
                </Route>
            </Switch>
        </div>
    );
}
