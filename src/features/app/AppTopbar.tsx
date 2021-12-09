import React from "react";
import { localeOption } from "primereact/api";
import { useHistory } from "react-router";
import { useParamGroupId } from "../../hooks/group";
import { useUser } from "../../hooks/user";
import { api, BaseObject } from "../../app/services";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { ProfileButton } from "../profile/ProfileButton";
import { Avatar } from "../prime/Avatar";
import { Dropdown } from "../prime/Dropdown";

export function AppTopbar() {
    const history = useHistory();
    const groupId = useParamGroupId();
    const user = useUser();
    const { data: groups } = api.useGetGroupsQuery();
    const { data: group, isFetching: isGroupChanging } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const { data: groupUser, isFetching: isUserChanging } = api.useGetUserQuery(
        { groupId: groupId, userId: user!.id },
        { skip: !(groupId && user) }
    );

    const startGroup = (
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon p-0 min-w-min surface-a">
                <Avatar image={group?.photo} imageAlt={group?.name} loading={isGroupChanging} imageHasBackground />
            </span>
            <Dropdown
                value={{ id: group?.id }}
                options={groups}
                onChange={(e) => {
                    history.push(`/app/${(e.value as BaseObject).id}`);
                }}
                dataKey="id"
                optionLabel="name"
                disabled={isGroupChanging}
                readOnly={groups?.length === 1}
            />
            <Button
                icon="pi pi-cog"
                className="p-button-outlined"
                tooltip={localeOption("settings")}
                tooltipOptions={{ position: "bottom" }}
                onClick={(e) => {
                    history.push(`${history.location.pathname}/settings`);
                }}
                disabled={isGroupChanging}
            />
        </div>
    );

    const endUser = (
        <ProfileButton
            profile={{ ...groupUser! }}
            className="border-primary"
            disabled={isUserChanging}
            loading={isUserChanging}
            tooltip={localeOption("profile")}
        />
    );

    const menuItems: MenuItem[] = [
        {
            label: localeOption("home"),
            icon: "pi pi-home",
            command: () => {
                history.push(`/app/${groupId}`);
            }
        },
        {
            label: localeOption("history"),
            icon: "pi pi-history",
            command: () => {
                history.push(`/app/${groupId}/history`);
            }
        }
    ];

    return <Menubar className="border-noround w-screen fixed z-5" start={startGroup} end={endUser} model={menuItems} />;
}
