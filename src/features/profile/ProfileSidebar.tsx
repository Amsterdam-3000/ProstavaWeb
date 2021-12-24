import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { useHistory } from "react-router";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useParamGroupId, useParamUserId } from "../../hooks/app";
import { api } from "../../app/services";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { Toast, ToastMessage } from "primereact/toast";
import { ProfileForm } from "./ProfileForm";
import { Loading } from "../pages/Loading";
import { MenuItem } from "primereact/menuitem";
import { SpeedDialAction } from "../prime/SpeedDialAction";

interface ProfileSidebarProps extends Omit<SidebarProps, "onHide"> {}

export function ProfileSidebar(props: ProfileSidebarProps) {
    const groupId = useParamGroupId();
    const userId = useParamUserId();
    const toastRef = useRef<Toast>(null);
    const history = useHistory();

    const { data: user, isFetching: isUserFetching } = api.useGetUserQuery(
        { groupId: groupId, userId: userId },
        { skip: !(groupId && userId) }
    );
    const [updateUser, { isLoading: isUserUpdating, isSuccess: isUserUpdateSuccess, isError: isUserUpdateError }] =
        api.useUpdateUserMutation();
    const [logout] = api.useLogoutMutation();

    const [canUpdateUser, setCanUpdateUser] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const profileForm = useForm({
        defaultValues: useMemo(() => {
            return user;
        }, [user]),
        mode: "onChange"
    });
    const { isDirty, isValid } = useFormState({ control: profileForm.control });

    const hideProfile = useCallback(
        (message?: ToastMessage) => {
            history.push(history.location.pathname.replace(/\/profile\/\d+$/, ""), { message: message });
        },
        [history]
    );

    //Show Profile
    useEffect(() => {
        if (!showProfile && /profile\/\d+$/.test(history.location.pathname)) {
            setTimeout(() => {
                setShowProfile(true);
            });
        }
        if (showProfile && !/profile\/\d+$/.test(history.location.pathname)) {
            setShowProfile(false);
        }
    }, [showProfile, history.location]);

    //Sync Form with user
    useEffect(() => {
        profileForm.reset(user);
    }, [user, profileForm]);

    //Show Save button when Form changed
    useEffect(() => {
        setCanUpdateUser(isDirty && isValid);
    }, [isDirty, isValid]);

    // Show Toast message when User failed
    useEffect(() => {
        if (toastRef.current && isUserUpdateError) {
            toastRef.current.show({
                severity: "error",
                summary: localeOption("profile")["notSaved"],
                detail: localeOption("profile")["fail"]
            });
        }
    }, [toastRef, isUserUpdateError]);
    //Hide Profile when User success
    useEffect(() => {
        if (isUserUpdateSuccess) {
            hideProfile({
                severity: "success",
                summary: localeOption("profile")["saved"],
                detail: localeOption("profile")["success"]
            });
        }
    }, [isUserUpdateSuccess, hideProfile]);

    const userMenuModel: MenuItem[] = [
        {
            label: localeOption("sendMessage"),
            icon: "pi pi-telegram",
            url: user?.link,
            target: "_blank",
            className: "p-button-info",
            template: SpeedDialAction
        },
        {
            label: localeOption("logOut"),
            icon: "pi pi-sign-out",
            className: "p-button-danger",
            disabled: user?.readonly,
            template: user?.readonly ? <div></div> : SpeedDialAction,
            command: async () => {
                try {
                    await logout().unwrap();
                    history.push("/login");
                } catch (error) {
                    console.log(error);
                }
            }
        }
    ];

    return (
        <FormProvider {...profileForm}>
            <Sidebar
                {...props}
                icons={() => (
                    <React.Fragment>
                        <Tooltip target=".user-menu .p-speeddial-action" position="bottom" />
                        <SpeedDial
                            direction="right"
                            showIcon="pi pi-bars"
                            hideIcon="pi pi-times"
                            className="user-menu relative mr-auto"
                            buttonClassName="p-button-text"
                            model={userMenuModel}
                            disabled={isUserUpdating}
                        />
                        <Button
                            className={classNames("p-button-rounded p-button-success mr-2", {
                                "fadeoutup opacity-0": isUserFetching || !canUpdateUser,
                                "fadeinup opacity-1": !isUserFetching && canUpdateUser
                            })}
                            icon="pi pi-check"
                            disabled={!canUpdateUser}
                            onClick={() => {
                                updateUser({ groupId: groupId, user: profileForm.getValues() });
                            }}
                            loading={isUserUpdating}
                        />
                    </React.Fragment>
                )}
                onHide={() => {
                    profileForm.reset(user);
                    hideProfile();
                }}
                visible={showProfile}
            >
                {isUserFetching ? <Loading /> : <ProfileForm disabled={isUserUpdating} readOnly={user?.readonly} />}
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
