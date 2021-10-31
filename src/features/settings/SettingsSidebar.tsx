import React, { useState, useEffect, useRef } from "react";
import momentTZ from "moment-timezone";
import classNames from "classnames";

import { useParamGroupId } from "../../hooks/group";
import { api, BaseObject, Group } from "../../app/services/prostava";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Menu } from "primereact/menu";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";

import { EmojiPhotoPicker } from "../emoji/EmojiPhotoPicker";
import { EmojiPhotoString } from "../emoji/EmojiPhotoString";
import { InputSlider } from "../prime/InputSlider";
import { InputNumber } from "../prime/InputNumber";
import { Dropdown } from "../prime/Dropdown";
import { EmojiStringChips } from "../emoji/EmojiStringChips";
import { ProgressSpinner } from "primereact/progressspinner";

export function SettingsSidebar(props: SidebarProps) {
    const groupId = useParamGroupId();
    const menu = useRef<Menu>(null);

    const [currentGroup, setCurrentGroup] = useState<Group>();
    const [isGroupChanged, setIsGroupChanged] = useState(false);

    const { data: group, isLoading: isGroupLoading } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const [fetchLanguages, { data: languages, isFetching: isLanguagesFetching }] = api.useLazyGetLanguagesQuery();
    const [fetchCurrencies, { data: currencies, isFetching: isCurrenciesFetching }] = api.useLazyGetCurrenciesQuery();
    const [fetchEmojiPhoto, { data: emojiPhoto, isFetching: isEmojiPhotoFetching }] = api.useLazyGetEmojiPhotoQuery();
    const [updateGroup, { isLoading: isGroupUpdating, isSuccess: isGroupUpdateSuccess, isError: isGroupUpdateError }] =
        api.useUpdateGroupMutation();

    //Group from API is changed
    useEffect(() => {
        setCurrentGroup(group);
    }, [group]);
    //Current group is changed
    useEffect(() => {
        setIsGroupChanged(JSON.stringify(currentGroup) !== JSON.stringify(group));
    }, [currentGroup, group]);
    //Language has changed
    useEffect(() => {
        if (!currentGroup?.language) {
            return;
        }
        fetchLanguages(currentGroup.language);
        fetchCurrencies(currentGroup.language);
    }, [currentGroup?.language, fetchLanguages, fetchCurrencies]);
    //Emoji has changed
    useEffect(() => {
        if (!currentGroup?.emoji) {
            return;
        }
        fetchEmojiPhoto(currentGroup.emoji);
    }, [currentGroup?.emoji, fetchEmojiPhoto]);

    const changeSetting = (changedSetting: Partial<Group>) => {
        const changedGroup = { ...currentGroup!, ...changedSetting };
        setCurrentGroup(changedGroup);
    };
    const saveSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateGroup(currentGroup!);
    };
    const cancelSettings = () => {
        setCurrentGroup(group);
        props.onHide();
    };

    const baseObjectTemplate = (object: BaseObject) => {
        return <EmojiPhotoString name={object?.name} photo={object?.photo!} />;
    };
    const calendarButtonTemplate = (item: MenuItem, options: MenuItemOptions) => {
        return (
            <a className={classNames(options.className)} target={item.target} href={item.url}>
                <span className={classNames(options.iconClassName, item.className, item.icon)}></span>
                <span className={classNames(options.labelClassName, item.className)}>{item.label}</span>
            </a>
        );
    };
    const calendarMenuModel: MenuItem[] = [
        {
            label: "Add to Apple",
            icon: "pi pi-apple",
            url: currentGroup?.calendar_apple,
            target: "_blank",
            className: "text-0",
            template: calendarButtonTemplate
        },
        {
            label: "Add to Google",
            icon: "pi pi-google",
            url: currentGroup?.calendar_google,
            target: "_blank",
            className: "text-blue-700",
            template: calendarButtonTemplate
        }
    ];

    return (
        <Sidebar
            {...props}
            icons={() => (
                <React.Fragment>
                    <Menu model={calendarMenuModel} popup ref={menu} />
                    <Button
                        label="Add to calendar"
                        icon="pi pi-calendar-plus"
                        className="p-button-link mr-5"
                        onClick={(e) => menu?.current?.toggle(e)}
                        loading={isGroupLoading}
                    />
                    <Button
                        className={classNames("p-button-rounded p-button-outline p-button-success mr-2", {
                            fadeoutup: !isGroupChanged,
                            "opacity-0": !isGroupChanged,
                            fadeinup: isGroupChanged,
                            "opacity-1": isGroupChanged
                        })}
                        icon="pi pi-check"
                        disabled={!isGroupChanged}
                        onClick={saveSettings}
                        loading={isGroupUpdating}
                    />
                </React.Fragment>
            )}
            onHide={cancelSettings}
        >
            {isGroupLoading ? (
                <div className="h-screen flex align-items-center justify-content-center">
                    <ProgressSpinner />
                </div>
            ) : (
                <React.Fragment>
                    <div className="field flex p-fluid">
                        {isEmojiPhotoFetching ? (
                            <Skeleton height="6rem" width="6rem" shape="circle" />
                        ) : (
                            <EmojiPhotoPicker
                                src={emojiPhoto}
                                alt={currentGroup?.name}
                                width="60"
                                height="60"
                                //TODO Fix console error when select
                                onSelect={(emoji) => {
                                    changeSetting({ emoji: emoji });
                                }}
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        )}
                        <span className="field ml-2 flex flex-column justify-content-center">
                            <label htmlFor="group-settings-name">Group name</label>
                            <InputText
                                id="group-settings-name"
                                value={currentGroup?.name}
                                onChange={(e) => {
                                    changeSetting({ name: e.target.value });
                                }}
                                disabled={currentGroup?.readonly || isGroupUpdating}
                                className={classNames({ "opacity-100": currentGroup?.readonly })}
                            />
                        </span>
                    </div>
                    <div className="flex flex-column p-fluid">
                        <span className="field">
                            <label htmlFor="group-settings-language">Language</label>
                            <Dropdown
                                id="group-settings-language"
                                value={{ id: currentGroup?.language }}
                                options={languages}
                                onChange={(e) => {
                                    changeSetting({ language: (e.value as BaseObject).id });
                                }}
                                dataKey="id"
                                optionLabel="name"
                                valueTemplate={baseObjectTemplate}
                                itemTemplate={baseObjectTemplate}
                                readOnly={currentGroup?.readonly}
                                loading={isLanguagesFetching}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label htmlFor="group-settings-currency">Currency</label>
                            <Dropdown
                                id="group-settings-currency"
                                value={{ id: currentGroup?.currency }}
                                options={currencies}
                                onChange={(e) => {
                                    changeSetting({ currency: (e.value as BaseObject).id });
                                }}
                                dataKey="id"
                                optionLabel="name"
                                valueTemplate={baseObjectTemplate}
                                itemTemplate={baseObjectTemplate}
                                readOnly={currentGroup?.readonly}
                                loading={isCurrenciesFetching || isLanguagesFetching}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label htmlFor="group-settings-timezone">Time Zone</label>
                            <Dropdown
                                id="group-settings-timezone"
                                value={{ id: currentGroup?.timezone }}
                                //TODO Back? Handler?
                                options={momentTZ.tz.names().map((timezone) => ({ id: timezone, label: timezone }))}
                                onChange={(e) => {
                                    changeSetting({ timezone: (e.value as BaseObject).id });
                                }}
                                dataKey="id"
                                filter
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label htmlFor="group-settings-types">Prostava types</label>
                            <EmojiStringChips
                                id="group-settings-types"
                                value={currentGroup?.prostava_types?.map((prostavaType) => prostavaType.string)}
                                onRemove={(e) => {
                                    changeSetting({
                                        prostava_types: currentGroup?.prostava_types.filter(
                                            (prostavaType) => prostavaType.string !== e.value[0]
                                        )
                                    });
                                }}
                                onAdd={(emojiToken) => {
                                    changeSetting({
                                        prostava_types: [...currentGroup?.prostava_types!, emojiToken]
                                    });
                                }}
                                allowDuplicate={false}
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label htmlFor="group-settings-days">Days before prostava expiry</label>
                            <InputNumber
                                id="group-settings-days"
                                value={currentGroup?.create_days_ago}
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
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label htmlFor="group-settings-hours">Hours to complete prostava</label>
                            <InputNumber
                                id="group-settings-hours"
                                value={currentGroup?.pending_hours}
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
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label id="123" htmlFor="group-settings-count">
                                Total number of participants
                            </label>
                            <InputSlider
                                id="group-settings-count"
                                value={currentGroup?.chat_members_count}
                                allowEmpty={false}
                                suffix={` participants out of ${10} members`}
                                min={0}
                                //TODO Max of groups
                                max={10}
                                onChange={(e) => {
                                    changeSetting({ chat_members_count: e.value });
                                }}
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                        <span className="field">
                            <label id="123" htmlFor="group-settings-percentage">
                                Minimum of participants to approve prostava
                            </label>
                            <InputSlider
                                id="group-settings-percentage"
                                value={currentGroup?.participants_min_percent}
                                allowEmpty={false}
                                suffix="% required for approval"
                                min={0}
                                max={100}
                                onChange={(e) => {
                                    changeSetting({ participants_min_percent: e.value });
                                }}
                                readOnly={currentGroup?.readonly}
                                disabled={isGroupUpdating}
                            />
                        </span>
                    </div>
                </React.Fragment>
            )}
        </Sidebar>
    );
}
