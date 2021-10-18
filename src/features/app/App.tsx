import React, { useEffect } from "react";

import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/store";
import { useParamGroupId } from "../../hooks/group";
import { api } from "../../app/services/prostava";
import { setGroupId, selectStorageGroupId } from "./appSlice";

import { Exception } from "../exception/Exception";
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
    const storageGroupId = useSelector(selectStorageGroupId);
    const paramGroupId = useParamGroupId();
    const {
        data: group,
        isSuccess: isGroupSuccess,
        isError: isGroupError
    } = api.useGetGroupQuery(paramGroupId, {
        skip: !paramGroupId
    });

    useEffect(() => {
        if (!isGroupsSuccess) {
            return;
        }
        if (!groups?.length) {
            history.push("/login", { error: { name: "ERROR", message: "You do not have Groups with Bot" } });
        }
    }, [isGroupsSuccess, groups, history]);

    useEffect(() => {
        if (paramGroupId) {
            return;
        }
        if (!storageGroupId) {
            return;
        }
        history.replace(`/app/${storageGroupId.toString()}`);
    }, [paramGroupId, storageGroupId, history]);

    useEffect(() => {
        if (!isGroupSuccess) {
            return;
        }
        if (!group?.id) {
            return;
        }
        dispatch(setGroupId(group.id));
    }, [isGroupSuccess, group, dispatch]);

    if (isGroupsLoading) {
        //TODO Change To Skeletons
        return (
            <div>
                <p>
                    <i>wait...</i>
                </p>
            </div>
        );
    }
    if (isGroupsError) {
        console.log(groupsError);
        return <Exception title="ERROR" detail="Something went wrong" />;
    }
    if (isGroupError) {
        return <Exception title="GROUP NOT FOUND" detail="Requested group does not exist" />;
    }

    //transition: margin-left $animationDuration $animationTimingFunction;
    return (
        <div className="layout-wrapper">
            <div className="layout-content-wrapper h-screen flex flex-column justify-content-between">
                <AppTopbar />
                <div className="layout-content px-4 py-6 flex-auto">1</div>
                <AppFooter />
            </div>
        </div>
    );
}
