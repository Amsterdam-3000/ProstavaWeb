import React from "react";

import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Ripple } from "primereact/ripple";
import { Avatar } from "./Avatar";

export function MenuItemImageLink(item: MenuItem, options: MenuItemOptions) {
    return (
        <a
            role="menuitem"
            className={options.className}
            target={item.target}
            href={item.url}
            onClick={(e) => {
                item.command && item.command({ originalEvent: e, item: item });
            }}
        >
            <Avatar className={options.iconClassName} image={item.icon} imageAlt={item.label} size="small" />
            <span className={options.labelClassName}>{item.label}</span>
            <Ripple />
        </a>
    );
}
