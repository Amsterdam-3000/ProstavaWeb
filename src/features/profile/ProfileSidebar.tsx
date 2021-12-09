import React, { useState, useEffect, useRef, useMemo } from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { useHistory } from "react-router";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useParamGroupId } from "../../hooks/group";
import { useParamUserId } from "../../hooks/user";
import { api } from "../../app/services";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ProfileContent } from "./ProfileContent";
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

    // Show Toast message when User updated
    useEffect(() => {
        if (!toastRef || (!isUserUpdateSuccess && !isUserUpdateError)) {
            return;
        }
        toastRef.current?.show({
            severity: isUserUpdateSuccess ? "success" : "error",
            summary: isUserUpdateSuccess
                ? localeOption("user")["profileSaved"]
                : localeOption("user")["profileNotSaved"],
            detail: isUserUpdateSuccess ? localeOption("user")["profileSuccess"] : localeOption("user")["profileFail"]
        });
    }, [toastRef, isUserUpdateSuccess, isUserUpdateError]);

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
                            className={classNames("p-button-rounded p-button-outline p-button-success mr-2", {
                                fadeoutup: !canUpdateUser,
                                "opacity-0": !canUpdateUser,
                                fadeinup: canUpdateUser,
                                "opacity-1": canUpdateUser
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
                    history.push(history.location.pathname.replace(/\/profile\/\d+$/, ""));
                }}
                visible={showProfile}
            >
                {isUserFetching ? <Loading /> : <ProfileContent user={user!} disabled={isUserUpdating} />}
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
