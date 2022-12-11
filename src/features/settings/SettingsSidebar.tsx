import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import classNames from "classnames";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useHistory } from "react-router";
import { useAppDispatch } from "../../hooks/store";
import { useParamGroupId } from "../../hooks/app";
import { api } from "../../app/services";
import { setLanguage } from "../app/appSlice";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Toast, ToastMessage } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Loading } from "../pages/Loading";
import { SpeedDialAction } from "../prime/SpeedDialAction";
import { SettingsForm } from "./SettingsForm";
import { localeOption } from "primereact/api";

interface SettingsSidebarProps extends Omit<SidebarProps, "onHide"> {}

export function SettingsSidebar(props: SettingsSidebarProps) {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const groupId = useParamGroupId();
    const toastRef = useRef<Toast>(null);

    const { data: group, isFetching: isGroupFetching } = api.useGetGroupQuery(groupId, { skip: !groupId });
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

    const t = localeOption("settings");

    const hideSettings = useCallback(
        (message?: ToastMessage) => {
            history.push(history.location.pathname.replace(/\/settings$/, ""), { message: message });
        },
        [history]
    );

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

    //Show Toast message when Group failed
    useEffect(() => {
        if (toastRef.current && isGroupUpdateError) {
            toastRef.current.show({
                severity: "error",
                summary: localeOption("settings")["notSaved"],
                detail: localeOption("settings")["fail"]
            });
        }
    }, [toastRef, isGroupUpdateError]);
    //Hide Settings when Group success
    useEffect(() => {
        if (isGroupUpdateSuccess) {
            hideSettings({
                severity: "success",
                summary: localeOption("settings")["saved"],
                detail: localeOption("settings")["success"]
            });
        }
    }, [isGroupUpdateSuccess, hideSettings]);

    const groupMenuModel: MenuItem[] = [
        {
            label: t["addApple"],
            icon: "pi pi-apple",
            url: group?.calendar_apple,
            target: "_blank",
            className: "text-0",
            template: SpeedDialAction
        },
        {
            label: t["addGoogle"],
            icon: "pi pi-google",
            url: group?.calendar_google,
            target: "_blank",
            className: "text-blue-800",
            template: SpeedDialAction
        }
    ];

    return (
        <FormProvider {...settingsForm}>
            <Sidebar
                {...props}
                icons={() => (
                    <React.Fragment>
                        <Tooltip target=".group-menu .p-speeddial-action" position="bottom" />
                        <Tooltip target=".p-speeddial-linear" content={t["addCalendar"]} />
                        <SpeedDial
                            direction="right"
                            showIcon="pi pi-calendar-plus"
                            hideIcon="pi pi-calendar-times"
                            className="group-menu relative mr-auto"
                            buttonClassName="p-button-text"
                            model={groupMenuModel}
                            disabled={isGroupUpdating}
                        />
                        <Button
                            className={classNames("p-button-rounded p-button-success mr-2", {
                                "fadeoutup opacity-0": !canUpdateGroup,
                                "fadeinup opacity-1": canUpdateGroup
                            })}
                            icon="pi pi-check"
                            disabled={!canUpdateGroup}
                            onClick={() => {
                                updateGroup({ group: settingsForm.getValues() });
                            }}
                            loading={isGroupUpdating}
                        />
                    </React.Fragment>
                )}
                visible={showSettings}
                onHide={() => {
                    settingsForm.reset(group);
                    dispatch(setLanguage(group!.language));
                    hideSettings();
                }}
            >
                {isGroupFetching ? (
                    <Loading />
                ) : (
                    <SettingsForm language={group?.language} disabled={isGroupUpdating} readOnly={group?.readonly} />
                )}
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
