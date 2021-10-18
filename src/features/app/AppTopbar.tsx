import React from "react";

import { useHistory } from "react-router";
import { useParamGroupId } from "../../hooks/group";
import { useUser } from "../../hooks/user";
import { api, Group } from "../../app/services/prostava";

import { Menubar } from "primereact/menubar";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

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

    const onGroupChange = (params: DropdownChangeParams) => {
        const group: Group = params.value;
        history.push(`/app/${group.id.toString()}`);
    };

    const startGroup = (
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon p-0">
                <Avatar image={group?.photo} imageAlt={group?.name} className="p-1" />
            </span>
            <Dropdown
                value={{ id: group?.id }}
                options={groups}
                onChange={onGroupChange}
                dataKey="id"
                optionLabel="name"
                disabled={groups?.length === 1 ? true : false}
                dropdownIcon={groups?.length === 1 ? "" : "pi pi-chevron-down"}
            />
            <Button icon="pi pi-cog" className="p-button-outlined" tooltip="Settings" loading={isGroupLoading} />
        </div>
    );

    const endUser = (
        <Button className="p-0 p-button-outlined profile-button" tooltip="Profile" loading={isUserLoading}>
            <Avatar image={groupUser?.photo} imageAlt={groupUser?.name} className="p-1" />
            <span className="profile-button-text hidden md:block p-2">{groupUser?.name}</span>
        </Button>
    );

    return <Menubar className="border-noround" start={startGroup} end={endUser} />;
}
