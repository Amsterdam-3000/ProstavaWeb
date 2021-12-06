import React from "react";

import logo from "../../assets/images/logo.png";

import { Avatar } from "../prime/Avatar";

export function AppFooter() {
    const startLogo = (
        <div className="p-menubar-start flex align-items-center border-1 border-b border-round">
            <Avatar image={logo} imageAlt={process.env.REACT_APP_BOT_NAME!} />
            <span className="ml-2 font-medium">{process.env.REACT_APP_BOT_NAME!}</span>
        </div>
    );
    const endCopyright = <span className="p-menubar-end text-secondary text-sm">&#169; Amsterdam 3000</span>;

    return (
        <div className="p-menubar">
            {startLogo}
            {endCopyright}
        </div>
    );
}
