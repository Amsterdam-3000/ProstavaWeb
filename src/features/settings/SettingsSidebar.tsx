import React, { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useHistory } from "react-router";
import { useAppDispatch } from "../../hooks/store";
import { useParamGroupId } from "../../hooks/group";
import { api } from "../../app/services";
import { setLanguage } from "../app/appSlice";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Loading } from "../pages/Loading";
import { SpeedDialAction } from "../prime/SpeedDialAction";
import { SettingsContent } from "./SettingsContent";
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

    const t = localeOption("group");

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
            summary: isGroupUpdateSuccess
                ? localeOption("group")["settingsSaved"]
                : localeOption("group")["settingsNotSaved"],
            detail: isGroupUpdateSuccess
                ? localeOption("group")["settingsSuccess"]
                : localeOption("group")["settingsFail"]
        });
    }, [toastRef, isGroupUpdateSuccess, isGroupUpdateError]);

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
                    dispatch(setLanguage(group!.language));
                    history.push(history.location.pathname.replace(/\/settings$/, ""));
                }}
            >
                {isGroupFetching ? <Loading /> : <SettingsContent group={group!} disabled={isGroupUpdating} />}
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
