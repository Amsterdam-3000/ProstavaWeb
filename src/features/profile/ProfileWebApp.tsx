import React, { useEffect, useMemo } from "react";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useParamGroupId, useParamUserId } from "../../hooks/app";
import { api } from "../../app/services";
import { localeOption } from "primereact/api";

import { ProfileForm } from "./ProfileForm";
import { Loading } from "../pages/Loading";

export function ProfileWebApp() {
    const groupId = useParamGroupId();
    const userId = useParamUserId();

    const { data: user, isFetching: isUserFetching } = api.useGetUserQuery(
        { groupId: groupId, userId: userId },
        { skip: !(groupId && userId) }
    );
    const [updateUser, { isLoading: isUserUpdating, isSuccess: isUserUpdateSuccess, isError: isUserUpdateError }] =
        api.useUpdateUserMutation();

    const profileForm = useForm({
        defaultValues: useMemo(() => {
            return user;
        }, [user]),
        mode: "onChange"
    });

    const { isDirty, isValid } = useFormState({ control: profileForm.control });

    useEffect(() => {
        Telegram.WebApp.MainButton.setText(localeOption("save"));
    }, []);

    useEffect(() => {
        Telegram.WebApp.MainButton.onClick(() => {
            if (!profileForm.getValues().id) {
                return;
            }
            updateUser({ groupId: groupId, user: profileForm.getValues(), fromWebApp: true });
        });
    }, [updateUser, groupId, profileForm]);

    //Sync Form with user
    useEffect(() => {
        profileForm.reset(user);
    }, [user, profileForm]);

    //Show Save button when Form changed
    useEffect(() => {
        if (isDirty && isValid) {
            Telegram.WebApp.MainButton.show();
        } else {
            Telegram.WebApp.MainButton.hide();
        }
    }, [isDirty, isValid]);

    useEffect(() => {
        if (isUserUpdating) {
            Telegram.WebApp.MainButton.showProgress(false);
        } else {
            Telegram.WebApp.MainButton.hideProgress();
        }
    }, [isUserUpdating]);

    useEffect(() => {
        if (isUserUpdateError) {
            Telegram.WebApp.showAlert(localeOption("profile")["fail"]);
        }
    }, [isUserUpdateError]);

    useEffect(() => {
        if (isUserUpdateSuccess) {
            Telegram.WebApp.close();
            Telegram.WebApp.showAlert(localeOption("profile")["success"]);
        }
    }, [isUserUpdateSuccess]);

    if (isUserFetching) {
        return <Loading />;
    }

    return (
        <FormProvider {...profileForm}>
            <ProfileForm disabled={isUserUpdating} readOnly={user?.readonly} />
        </FormProvider>
    );
}
