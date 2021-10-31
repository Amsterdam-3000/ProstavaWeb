import React from "react";

import { useHistory } from "react-router";
import { useParamGroupId } from "../../hooks/group";
import { useUser } from "../../hooks/user";
import { api, BaseObject } from "../../app/services/prostava";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "../prime/Dropdown";

export function AppTopbar() {
    const history = useHistory();
    const groupId = useParamGroupId();
    const user = useUser();
    const { data: groups } = api.useGetGroupsQuery();
    const { data: group, isLoading: isGroupLoading } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const { data: groupUser, isLoading: isUserLoading } = api.useGetGroupUserQuery(
        { groupId: groupId, userId: user!.id },
        { skip: !(groupId && user) }
    );

    const startGroup = (
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon p-0">
                <Avatar image={group?.photo} imageAlt={group?.name} className="p-1" />
            </span>
            <Dropdown
                value={{ id: group?.id }}
                options={groups}
                onChange={(e) => {
                    history.push(`/app/${(e.value as BaseObject).id}`);
                }}
                dataKey="id"
                optionLabel="name"
                readOnly={groups?.length === 1}
            />
            <Button
                icon="pi pi-cog"
                className="p-button-outlined"
                loading={isGroupLoading}
                tooltip="Settings"
                tooltipOptions={{ position: "bottom" }}
                onClick={(e) => {
                    history.push(`${history.location.pathname}/settings`);
                }}
            />
        </div>
    );

    const endUser = (
        <Button
            className="p-0 p-button-outlined profile-button"
            loading={isUserLoading}
            tooltip="Profile"
            tooltipOptions={{ position: "top", className: "" }}
        >
            <Avatar image={groupUser?.photo} imageAlt={groupUser?.name} className="p-1" />
            <span className="profile-button-text hidden md:block p-2">{groupUser?.name}</span>
        </Button>
    );

    return <Menubar className="border-noround" start={startGroup} end={endUser} />;
}
