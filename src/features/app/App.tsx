import React, { useEffect } from "react";

import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/store";
import { useParamGroupId } from "../../hooks/group";
import { useParamUserId, useUser } from "../../hooks/user";
import { api } from "../../app/services/prostava";
import { setGroupId, selectStorageGroupId } from "./appSlice";

import { Exception } from "../pages/Exception";
import { Loading } from "../pages/Loading";
import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { SettingsSidebar } from "../settings/SettingsSidebar";
import { ProfileSidebar } from "../profile/ProfileSidebar";

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
    const storageGroupId = useSelector(selectStorageGroupId);
    const paramGroupId = useParamGroupId();
    const paramUserId = useParamUserId();
    const {
        data: group,
        isLoading: isGroupLoading,
        isSuccess: isGroupSuccess,
        isError: isGroupError
    } = api.useGetGroupQuery(paramGroupId, {
        skip: !paramGroupId
    });
    const user = useUser();
    const { data: groupUser, isLoading: isUserLoading } = api.useGetGroupUserQuery(
        { groupId: paramGroupId, userId: user!.id },
        { skip: !(paramGroupId && user) }
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
            history.push("/login", { error: { name: "ERROR", message: "You do not have Groups with Bot" } });
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

    if (isGroupsLoading || isGroupLoading || isUserLoading) {
        return <Loading />;
    }
    if (isGroupsError) {
        console.log(groupsError);
        return <Exception title="ERROR" detail="Something went wrong" />;
    }
    if (isGroupError) {
        return <Exception title="GROUP NOT FOUND" detail="Requested group does not exist" />;
    }

    return (
        <div className="layout-wrapper">
            <div className="layout-content-wrapper h-screen flex flex-column justify-content-between">
                <AppTopbar />
                <div className="layout-content px-4 py-6 flex-auto">1</div>
                <AppFooter />
            </div>
            <SettingsSidebar position="left" />
            <ProfileSidebar position="right" />
        </div>
    );
}
