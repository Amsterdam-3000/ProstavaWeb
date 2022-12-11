import React, { useEffect, useMemo } from "react";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useParamGroupId } from "../../hooks/app";
import { api } from "../../app/services";
import { localeOption } from "primereact/api";

import { SettingsForm } from "./SettingsForm";
import { Loading } from "../pages/Loading";

export function SettingsWebApp() {
    const groupId = useParamGroupId();

    const { data: group, isFetching: isGroupFetching } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const [updateGroup, { isLoading: isGroupUpdating, isSuccess: isGroupUpdateSuccess, isError: isGroupUpdateError }] =
        api.useUpdateGroupMutation();

    const settingsForm = useForm({
        defaultValues: useMemo(() => {
            return group;
        }, [group]),
        mode: "onChange"
    });

    const { isDirty, isValid } = useFormState({ control: settingsForm.control });

    useEffect(() => {
        Telegram.WebApp.MainButton.setText(localeOption("save"));
    }, []);

    useEffect(() => {
        Telegram.WebApp.MainButton.onClick(() => {
            if (!settingsForm.getValues().id) {
                return;
            }
            updateGroup({ group: settingsForm.getValues(), fromWebApp: true });
        });
    }, [updateGroup, groupId, settingsForm]);

    //Sync Form with group
    useEffect(() => {
        settingsForm.reset(group);
    }, [group, settingsForm]);

    //Show Save button when Form changed
    useEffect(() => {
        if (isDirty && isValid) {
            Telegram.WebApp.MainButton.show();
        } else {
            Telegram.WebApp.MainButton.hide();
        }
    }, [isDirty, isValid]);

    useEffect(() => {
        if (isGroupUpdating) {
            Telegram.WebApp.MainButton.showProgress(false);
        } else {
            Telegram.WebApp.MainButton.hideProgress();
        }
    }, [isGroupUpdating]);

    useEffect(() => {
        if (isGroupUpdateError) {
            Telegram.WebApp.showAlert(localeOption("settings")["fail"]);
        }
    }, [isGroupUpdateError]);

    useEffect(() => {
        if (isGroupUpdateSuccess) {
            Telegram.WebApp.close();
            Telegram.WebApp.showAlert(localeOption("settings")["success"]);
        }
    }, [isGroupUpdateSuccess]);

    if (isGroupFetching) {
        return <Loading />;
    }

    return (
        <FormProvider {...settingsForm}>
            <SettingsForm language={group?.language} disabled={isGroupUpdating} readOnly={group?.readonly} />
        </FormProvider>
    );
}
