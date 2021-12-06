import React from "react";
import classNames from "classnames";

import { SpeedDialProps } from "primereact/speeddial";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Ripple } from "primereact/ripple";

export function SpeedDialAction(item: MenuItem, options: MenuItemOptions) {
    return (
        <a
            role="menuitem"
            className={classNames(
                options.className,
                item.className,
                (options.props as SpeedDialProps).buttonClassName,
                "p-button p-button-rounded"
            )}
            target={item.target}
            href={item.url}
            data-pr-tooltip={item.label}
            onClick={(e) => {
                item.command && item.command({ originalEvent: e, item: item });
            }}
        >
            <span className={classNames(options.iconClassName, item.icon)}></span>
            <Ripple />
        </a>
    );
}
