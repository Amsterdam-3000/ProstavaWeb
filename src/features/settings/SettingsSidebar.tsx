import React, { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";

import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useHistory } from "react-router";
import { useParamGroupId } from "../../hooks/group";
import { api } from "../../app/services/prostava";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import { SettingsContent } from "./SettingsContent";

interface SettingsSidebarProps extends Omit<SidebarProps, "onHide"> {}

export function SettingsSidebar(props: SettingsSidebarProps) {
    const history = useHistory();
    const groupId = useParamGroupId();
    const menuRef = useRef<Menu>(null);
    const toastRef = useRef<Toast>(null);

    const { data: group } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const [updateGroup, { isLoading: isGroupUpdating, isSuccess: isGroupUpdateSuccess, isError: isGroupUpdateError }] =
        api.useUpdateGroupMutation();
    const [canUpdateGroup, setCanUpdateGroup] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const settingsForm = useForm({
        defaultValues: useMemo(() => {
            return group;
        }, [group]),
        mode: "onChange"
    });
    const { isDirty, isValid } = useFormState({ control: settingsForm.control });

    //Show Settings
    useEffect(() => {
        if (!showSettings && /settings$/.test(history.location.pathname)) {
            setTimeout(() => {
                setShowSettings(true);
            });
        }
        if (showSettings && !/settings$/.test(history.location.pathname)) {
            setShowSettings(false);
        }
    }, [showSettings, history.location]);

    //Sync Form with group
    useEffect(() => {
        settingsForm.reset(group);
    }, [group, settingsForm]);

    //Show Save button when Form changed
    useEffect(() => {
        setCanUpdateGroup(isDirty && isValid);
    }, [isDirty, isValid]);

    //Show Toast message when Group updated
    useEffect(() => {
        if (!toastRef || (!isGroupUpdateSuccess && !isGroupUpdateError)) {
            return;
        }
        toastRef.current?.show({
            severity: isGroupUpdateSuccess ? "success" : "error",
            summary: isGroupUpdateSuccess ? "SETTINGS SAVED" : "SETTINGS NOT SAVED",
            detail: isGroupUpdateSuccess ? "Settings have been saved successfully" : "Failed to save settings"
        });
    }, [toastRef, isGroupUpdateSuccess, isGroupUpdateError]);

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
            url: group?.calendar_apple,
            target: "_blank",
            className: "text-0",
            template: calendarButtonTemplate
        },
        {
            label: "Add to Google",
            icon: "pi pi-google",
            url: group?.calendar_google,
            target: "_blank",
            className: "text-blue-800",
            template: calendarButtonTemplate
        }
    ];

    return (
        <FormProvider {...settingsForm}>
            <Sidebar
                {...props}
                icons={() => (
                    <React.Fragment>
                        <Menu model={calendarMenuModel} popup ref={menuRef} />
                        <Button
                            label="Add to calendar"
                            icon="pi pi-calendar-plus"
                            className="p-button-link mr-5"
                            onClick={(e) => menuRef?.current?.toggle(e)}
                            loading={isGroupUpdating}
                        />
                        <Button
                            className={classNames("p-button-rounded p-button-outline p-button-success mr-2", {
                                fadeoutup: !canUpdateGroup,
                                "opacity-0": !canUpdateGroup,
                                fadeinup: canUpdateGroup,
                                "opacity-1": canUpdateGroup
                            })}
                            icon="pi pi-check"
                            disabled={!canUpdateGroup}
                            onClick={() => {
                                updateGroup(settingsForm.getValues());
                            }}
                            loading={isGroupUpdating}
                        />
                    </React.Fragment>
                )}
                visible={showSettings}
                onHide={() => {
                    settingsForm.reset(group);
                    history.push(history.location.pathname.replace(/\/settings$/, ""));
                }}
            >
                <SettingsContent group={group!} disabled={isGroupUpdating} />
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
