import React, { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";

import { useHistory } from "react-router";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useParamGroupId } from "../../hooks/group";
import { useParamUserId } from "../../hooks/user";
import { api } from "../../app/services/prostava";

import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Toast } from "primereact/toast";
// import { SettingsContent } from "./SettingsContent";

interface ProfileSidebar extends Omit<SidebarProps, "onHide"> {}

export function ProfileSidebar(props: ProfileSidebar) {
    const groupId = useParamGroupId();
    const userId = useParamUserId();
    const menuRef = useRef<Menu>(null);
    const toastRef = useRef<Toast>(null);
    const history = useHistory();

    const { data: user, isLoading: isUserLoading } = api.useGetGroupUserQuery(
        { groupId: groupId, userId: userId },
        { skip: !(groupId && userId) }
    );
    // const [updateGroup, { isLoading: isGroupUpdating, isSuccess: isGroupUpdateSuccess, isError: isGroupUpdateError }] =
    //     api.useUpdateGroupMutation();

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

    //Show Toast message when User updated
    // useEffect(() => {
    //     if (!toastRef || (!isGroupUpdateSuccess && !isGroupUpdateError)) {
    //         return;
    //     }
    //     toastRef.current?.show({
    //         severity: isGroupUpdateSuccess ? "success" : "error",
    //         summary: isGroupUpdateSuccess ? "SETTINGS SAVED" : "SETTINGS NOT SAVED",
    //         detail: isGroupUpdateSuccess ? "Settings have been saved successfully" : "Failed to save settings"
    //     });
    // }, [toastRef, isGroupUpdateSuccess, isGroupUpdateError]);

    // const calendarButtonTemplate = (item: MenuItem, options: MenuItemOptions) => {
    //     return (
    //         <a className={classNames(options.className)} target={item.target} href={item.url}>
    //             <span className={classNames(options.iconClassName, item.className, item.icon)}></span>
    //             <span className={classNames(options.labelClassName, item.className)}>{item.label}</span>
    //         </a>
    //     );
    // };
    // const calendarMenuModel: MenuItem[] = [
    //     {
    //         label: "Add to Apple",
    //         icon: "pi pi-apple",
    //         url: group?.calendar_apple,
    //         target: "_blank",
    //         className: "text-0",
    //         template: calendarButtonTemplate
    //     },
    //     {
    //         label: "Add to Google",
    //         icon: "pi pi-google",
    //         url: group?.calendar_google,
    //         target: "_blank",
    //         className: "text-blue-800",
    //         template: calendarButtonTemplate
    //     }
    // ];

    return (
        <FormProvider {...profileForm}>
            <Sidebar
                {...props}
                // icons={() => (
                //     <React.Fragment>
                //         <Menu model={calendarMenuModel} popup ref={menuRef} />
                //         <Button
                //             label="Add to calendar"
                //             icon="pi pi-calendar-plus"
                //             className="p-button-link mr-5"
                //             onClick={(e) => menuRef?.current?.toggle(e)}
                //             loading={isGroupUpdating}
                //         />
                //         <Button
                //             className={classNames("p-button-rounded p-button-outline p-button-success mr-2", {
                //                 fadeoutup: !canUpdateGroup,
                //                 "opacity-0": !canUpdateGroup,
                //                 fadeinup: canUpdateGroup,
                //                 "opacity-1": canUpdateGroup
                //             })}
                //             icon="pi pi-check"
                //             disabled={!canUpdateGroup}
                //             onClick={() => {
                //                 updateGroup(settingsForm.getValues());
                //             }}
                //             loading={isGroupUpdating}
                //         />
                //     </React.Fragment>
                // )}
                onHide={() => {
                    profileForm.reset(user);
                    history.push(history.location.pathname.replace(/\/profile\/\d+$/, ""));
                }}
                visible={showProfile}
            >
                {/* <SettingsContent group={group!} disabled={isGroupUpdating} /> */}
                <Toast ref={toastRef} />
            </Sidebar>
        </FormProvider>
    );
}
