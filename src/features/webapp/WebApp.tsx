import React from "react";
import { Route, Switch } from "react-router";

import { ProfileWebApp } from "../profile/ProfileWebApp";
import { ProstavaCardWebApp } from "../prostava/ProstavaCardWebApp";
import { ProstavaWebApp } from "../prostava/ProstavaWebApp";
import { SettingsWebApp } from "../settings/SettingsWebApp";

export function WebApp() {
    return (
        <div className="webapp-content">
            <Switch>
                <Route path="*/:groupId/settings" component={SettingsWebApp} />
                <Route path="*/:groupId/profile/:userId" component={ProfileWebApp} />
                <Route path="*/:groupId/prostava/:prostavaId" component={ProstavaWebApp} />
                <Route path="*/:groupId/prostavacard/:prostavaId" component={ProstavaCardWebApp} />
            </Switch>
        </div>
    );
}
