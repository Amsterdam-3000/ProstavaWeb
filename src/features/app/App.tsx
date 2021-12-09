import React, { useEffect } from "react";
import { localeOption } from "primereact/api";
import { Route, Switch, useHistory } from "react-router";
import { useAppSelector } from "../../hooks/store";
import { useAppDispatch } from "../../hooks/store";
import { useParamGroupId } from "../../hooks/group";
import { useParamUserId, useUser } from "../../hooks/user";
import { api } from "../../app/services";
import { setGroupId, selectStorageGroupId, setLanguage } from "./appSlice";

import { BlockUI } from "primereact/blockui";
import { Exception } from "../pages/Exception";
import { Loading } from "../pages/Loading";
import { SettingsSidebar } from "../settings/SettingsSidebar";
import { ProfileSidebar } from "../profile/ProfileSidebar";
import { Dashboard } from "../dashboard/Dashboard";
import { History } from "../prostava/History";
import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";

export function App() {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const {
        data: groups,
        error: groupsError,
        isSuccess: isGroupsSuccess,
        isLoading: isGroupsLoading,
        isError: isGroupsError
    } = api.useGetGroupsQuery();
    const storageGroupId = useAppSelector(selectStorageGroupId);
    const paramGroupId = useParamGroupId();
    const paramUserId = useParamUserId();
    const {
        data: group,
        isLoading: isGroupLoading,
        isFetching: isGroupFetching,
        isSuccess: isGroupSuccess,
        isError: isGroupError
    } = api.useGetGroupQuery(paramGroupId, {
        skip: !paramGroupId
    });
    const user = useUser();
    const { data: groupUser, isLoading: isGroupUserLoading } = api.useGetUserQuery(
        { groupId: paramGroupId, userId: user!.id },
        { skip: !(paramGroupId && user?.id) }
    );
    const { isError: isParamUserError } = api.useGetUserQuery(
        { groupId: paramGroupId, userId: paramUserId },
        { skip: !(paramGroupId && paramUserId) }
    );

    //Delete '/' from end of the url
    useEffect(() => {
        if (history.location.pathname.endsWith("/")) {
            history.replace(history.location.pathname.replace(/\/$/, ""));
        }
    }, [history]);

    //Back to Login page for users without groups
    useEffect(() => {
        if (!isGroupsSuccess) {
            return;
        }
        if (!groups?.length) {
            history.push("/login", {
                error: {
                    name: localeOption("app")["error"],
                    message: localeOption("app")["noGroups"]
                }
            });
        }
    }, [isGroupsSuccess, groups, history]);

    //Add groupId from first Group to url
    useEffect(() => {
        if (paramGroupId) {
            return;
        }
        if (!storageGroupId) {
            return;
        }
        history.replace(`/app/${storageGroupId}`);
    }, [paramGroupId, storageGroupId, history]);

    //Set groupId to locale storage
    useEffect(() => {
        if (!isGroupSuccess) {
            return;
        }
        if (!group) {
            return;
        }
        dispatch(setGroupId(group.id));
        dispatch(setLanguage(group.language));
    }, [isGroupSuccess, group, dispatch]);

    //Add userId to url
    useEffect(() => {
        if (paramUserId) {
            return;
        }
        if (!groupUser) {
            return;
        }
        if (!history.location.pathname.endsWith("/profile")) {
            return;
        }
        history.replace(`${history.location.pathname}/${groupUser.id}`);
    }, [paramUserId, groupUser, history, history.location]);

    if (isGroupsLoading || isGroupLoading || isGroupUserLoading) {
        return <Loading background />;
    }
    if (isGroupsError) {
        console.log(groupsError);
        return (
            <Exception title={localeOption("app")["error"]} detail={localeOption("app")["goWrong"]} severity="error" />
        );
    }
    if (isGroupError) {
        return (
            <Exception
                title={localeOption("app")["noGroup"]}
                detail={localeOption("app")["noGropExists"]}
                severity="info"
            />
        );
    }
    if (isParamUserError) {
        return (
            <Exception
                title={localeOption("app")["noUser"]}
                detail={localeOption("app")["noUserExists"]}
                severity="info"
            />
        );
    }

    return (
        <div className="layout-wrapper">
            <div className="layout-content-wrapper h-screen flex flex-column justify-content-between">
                <AppTopbar />
                <div className="layout-content flex-auto mt-header">
                    <BlockUI
                        className="min-h-content z-0"
                        blocked={isGroupFetching}
                        template={<i className="pi pi-spin pi-spinner text-4xl" />}
                    >
                        <Switch>
                            <Route path="*/history" component={History} />
                            <Route path="*" component={Dashboard} />
                        </Switch>
                    </BlockUI>
                </div>
                <AppFooter />
            </div>
            <SettingsSidebar position="left" />
            <ProfileSidebar position="right" />
        </div>
    );
}
