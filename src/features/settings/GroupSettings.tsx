import React, { useState, useEffect } from "react";
import momentTZ from "moment-timezone";

import { useParamGroupId } from "../../hooks/group";
import { api, BaseObject, Group } from "../../app/services/prostava";

import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { Chips } from "primereact/chips";
import { InputNumber } from "primereact/inputnumber";
// import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { EmojiPicker } from "../commons/EmojiPicker";
import { EmojiString } from "../commons/EmojiString";
import { InputSlider } from "../commons/InputSlider";

export function GroupSettings() {
    const groupId = useParamGroupId();
    const { data: group, isLoading: isGroupLoading } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const { data: languages, isLoading: isLanguagesLoading } = api.useGetGroupLanguagesQuery(groupId, {
        skip: !groupId
    });
    const { data: currencies, isLoading: isCurrenciesLoading } = api.useGetGroupCurrenciesQuery(groupId, {
        skip: !groupId
    });
    const [updateGroup] = api.useUpdateGroupMutation();
    const [newGroup, setNewGroup] = useState<Group>();

    useEffect(() => {
        setNewGroup(group);
    }, [group]);

    const changeSetting = (changedSetting: Partial<Group>) => {
        setNewGroup({ ...newGroup!, ...changedSetting });
    };

    const baseObjectTemplate = (object: BaseObject) => {
        return <EmojiString name={object?.name} photo={object?.photo} />;
    };

    return (
        <div className="flex flex-column">
            <div className="field flex p-fluid">
                <EmojiPicker src={newGroup?.photo} alt={newGroup?.name} width="60" height="60" />
                <span className="field ml-2 flex flex-column justify-content-center">
                    <label htmlFor="group-settings-name">Group name</label>
                    <InputText
                        id="group-settings-name2"
                        value={newGroup?.name}
                        onChange={(e) => {
                            changeSetting({ name: e.target.value });
                        }}
                    />
                </span>
            </div>
            <div className="flex flex-column p-fluid">
                {/* <Divider className="text-primary font-medium" align="right">
                    Defaults
                </Divider> */}
                <span className="field">
                    <label htmlFor="group-settings-language">Language</label>
                    <Dropdown
                        id="group-settings-language"
                        value={{ id: newGroup?.language }}
                        options={languages}
                        onChange={(e) => {
                            changeSetting({ language: (e.value as BaseObject).id });
                        }}
                        dataKey="id"
                        optionLabel="name"
                        valueTemplate={baseObjectTemplate}
                        itemTemplate={baseObjectTemplate}
                    />
                </span>
                <span className="field">
                    <label htmlFor="group-settings-currency">Currency</label>
                    <Dropdown
                        id="group-settings-currency"
                        value={{ id: newGroup?.currency }}
                        options={currencies}
                        onChange={(e) => {
                            changeSetting({ currency: (e.value as BaseObject).id });
                        }}
                        dataKey="id"
                        optionLabel="name"
                        valueTemplate={baseObjectTemplate}
                        itemTemplate={baseObjectTemplate}
                    />
                </span>
                <span className="field">
                    <label htmlFor="group-settings-timezone">Time Zone</label>
                    <Dropdown
                        id="group-settings-timezone"
                        value={{ id: newGroup?.timezone }}
                        //TODO Back? Handler?
                        options={momentTZ.tz.names().map((timezone) => ({ id: timezone, label: timezone }))}
                        onChange={(e) => {
                            changeSetting({ timezone: (e.value as BaseObject).id });
                        }}
                        dataKey="id"
                        filter
                    />
                </span>
                <span className="field">
                    <label htmlFor="group-settings-types">Prostava types</label>
                    <Chips
                        id="group-settings-types"
                        value={newGroup?.prostava_types?.map((prostavaType) => prostavaType.string)}
                        onRemove={(e) => {
                            // console.log(e);
                        }}
                        onAdd={(e) => {
                            console.log(e.value);
                        }}
                        allowDuplicate={false}
                    />
                </span>
                {/* <Divider className="mdb-5 text-primary font-medium" align="right">
                    Prostava
                </Divider> */}
                <span className="field">
                    <label htmlFor="group-settings-days">Days before prostava expiry</label>
                    <InputNumber
                        id="group-settings-days"
                        value={newGroup?.create_days_ago}
                        allowEmpty={false}
                        prefix="Expires in "
                        suffix=" days"
                        showButtons
                        incrementButtonClassName="p-button-outlined"
                        decrementButtonClassName="p-button-outlined"
                        min={0}
                        //TODO Max <9999?
                        onChange={(e) => {
                            changeSetting({ create_days_ago: e.value });
                        }}
                    />
                </span>
                <span className="field">
                    <label htmlFor="group-settings-hours">Hours to complete prostava</label>
                    <InputNumber
                        id="group-settings-hours"
                        value={newGroup?.pending_hours}
                        allowEmpty={false}
                        prefix="Completed in "
                        suffix=" hours"
                        showButtons
                        incrementButtonClassName="p-button-outlined"
                        decrementButtonClassName="p-button-outlined"
                        min={0}
                        //TODO Max <999?
                        onChange={(e) => {
                            changeSetting({ pending_hours: e.value });
                        }}
                    />
                </span>
                <span className="field">
                    <label id="123" htmlFor="group-settings-count">
                        Total number of participants
                    </label>
                    <InputSlider
                        id="group-settings-count"
                        value={newGroup?.chat_members_count}
                        allowEmpty={false}
                        suffix={` participants out of ${10} members`}
                        min={0}
                        //TODO Max of groups
                        max={10}
                        onChange={(e) => {
                            changeSetting({ chat_members_count: e.value });
                        }}
                    />
                </span>
                <span className="field">
                    <label id="123" htmlFor="group-settings-percentage">
                        Minimum of participants to approve prostava
                    </label>
                    <InputSlider
                        id="group-settings-percentage"
                        value={newGroup?.participants_min_percent}
                        allowEmpty={false}
                        suffix="% required for approval"
                        min={0}
                        max={100}
                        onChange={(e) => {
                            changeSetting({ participants_min_percent: e.value });
                        }}
                    />
                </span>
                {/* <Divider className="mdb-5 text-primary font-medium" align="right">
                    Calendar
                </Divider> */}
                <div className="flex">
                    <Button
                        icon="pi pi-apple"
                        label="Add Apple"
                        className="p-button-link text-0"
                        onClick={() => {
                            window.open(newGroup?.calendar_apple, "_blank");
                        }}
                    />
                    <Button
                        icon="pi pi-google"
                        label="Add Google"
                        className="p-button-link text-blue-700"
                        onClick={() => {
                            window.open(newGroup?.calendar_google, "_blank");
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
