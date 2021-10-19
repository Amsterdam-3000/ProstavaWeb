import React from "react";

import { useParamGroupId } from "../../hooks/group";
import { api, Group } from "../../app/services/prostava";

import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";

export function GroupSettings() {
    const groupId = useParamGroupId();
    const { data: group, isLoading: isGroupLoading } = api.useGetGroupQuery(groupId, { skip: !groupId });

    return (
        <div className="p-card p-flui mt-1">
            {/* <Button className="p-button-rounded p-button-outlined p-4"> */}
            {/* <Avatar image={group?.photo} imageAlt={group?.name} size="xlarge" className="surface-a" shape="circle" /> */}
            {/* </Button> */}
            {/* <div className="p-field">
                <label htmlFor="group-emoji">Group emoji</label>
                <Button id="group-emoji"></Button>
            </div> */}
            <Image src={group?.photo} alt={group?.name} imageClassName="surface-" className="surface-a block w-min border-circle p-5"/>
        </div>
    );
}
