import React from "react";
import classNames from "classnames";

import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Ripple } from "primereact/ripple";

export function MenuItemLink(item: MenuItem, options: MenuItemOptions) {
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
            <span className={classNames(options.iconClassName, item.className)}></span>
            <span className={classNames(options.labelClassName, item.className)}>{item.label}</span>
            <Ripple />
        </a>
    );
}
