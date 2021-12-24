import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import classNames from "classnames";
import { localeOption } from "primereact/api";
import { useHistory } from "react-router";
import { useForm, useFormState, FormProvider } from "react-hook-form";
import { useParamGroupId, useParamProstavaId, useQueryIsRequest } from "../../hooks/app";
import { useUser } from "../../hooks/user";
import { api, useGetUserNewProstava } from "../../app/services";

import { Dialog, DialogProps } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast, ToastMessage } from "primereact/toast";
import { Loading } from "../pages/Loading";
import { ProstavaForm } from "./ProstavaForm";

interface ProstavaDialogProps extends Omit<DialogProps, "onHide"> {}

export function ProstavaDialog(props: ProstavaDialogProps) {
    const groupId = useParamGroupId();
    const prostavaId = useParamProstavaId();
    const isRequest = useQueryIsRequest();
    const user = useUser();

    const toastRef = useRef<Toast>(null);
    const history = useHistory();

    const { data: group, isFetching: isGroupFetching } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const { data: prostava, isFetching: isProstavaFetching } = api.useGetProstavaQuery(
        {
            groupId: groupId,
            prostavaId: prostavaId,
            isRequest: isRequest
        },
        { skip: !groupId }
    );
    const { data: newProstava } = useGetUserNewProstava(groupId, user?.id, isRequest, !!prostavaId);

    const [
        announceProstava,
        { isLoading: isProstavaAnnouncing, isSuccess: isProstavaAnnounceSuccess, isError: isProstavaAnnounceError }
    ] = api.useAnnounceProstavaMutation();

    const [showProstava, setShowProstava] = useState(false);

    const prostavaForm = useForm({
        defaultValues: useMemo(() => {
            return prostava;
        }, [prostava]),
        mode: "onChange"
    });
    const { isValid } = useFormState({ control: prostavaForm.control });

    const hideProstava = useCallback(
        (message?: ToastMessage) => {
            history.push(history.location.pathname.replace(/\/prostava(\/\w+)?$/, ""), { message: message });
        },
        [history]
    );

    //Add ProstavaId to url
    useEffect(() => {
        if (prostavaId || !newProstava) {
            return;
        }
        if (history.location.pathname.endsWith("/prostava")) {
            history.replace(`${history.location.pathname}/${newProstava.id}`);
        }
    }, [prostavaId, newProstava, history, history.location]);

    //Sync Form with prostava
    useEffect(() => {
        if (history.location.pathname.includes("/prostava")) {
            prostavaForm.reset(prostava);
        }
    }, [prostava, prostavaForm, history.location.pathname]);

    //Show Prostava
    useEffect(() => {
        if (!showProstava && /prostava(\/\w+)?$/.test(history.location.pathname)) {
            setShowProstava(true);
        }
        if (showProstava && !/prostava(\/\w+)?$/.test(history.location.pathname)) {
            setShowProstava(false);
        }
    }, [showProstava, history.location]);

    // Show Toast message when failed
    useEffect(() => {
        if (toastRef.current && isProstavaAnnounceError) {
            toastRef.current.show({
                severity: "error",
                summary: localeOption("prostava")["notAnnounced"],
                detail: localeOption("prostava")["announceFail"]
            });
        }
    }, [toastRef, isProstavaAnnounceError]);
    // Hide Prostava when success
    useEffect(() => {
        if (isProstavaAnnounceSuccess) {
            hideProstava({
                severity: "success",
                summary: localeOption("prostava")["announced"],
                detail: localeOption("prostava")["announceSuccess"]
            });
        }
    }, [isProstavaAnnounceSuccess, hideProstava]);

    return (
        <FormProvider {...prostavaForm}>
            <Dialog
                {...props}
                header={localeOption("prostava")["announceProstava"]}
                onHide={() => {
                    prostavaForm.reset(prostava);
                    hideProstava();
                }}
                visible={showProstava}
                keepInViewport={false}
                footer={
                    <Button
                        icon="pi pi-bell"
                        label={localeOption("prostava")["announce"]}
                        onClick={prostavaForm.handleSubmit((prostava) => {
                            announceProstava({
                                groupId: groupId,
                                prostavaId: prostavaId,
                                prostava: prostava
                            });
                        })}
                        className={classNames({
                            hidden:
                                isGroupFetching ||
                                isProstavaFetching ||
                                !prostavaForm.getValues()?.id ||
                                prostava?.readonly,
                            "p-button-success": isValid,
                            "p-button-outlined": !isValid
                        })}
                        loading={isProstavaAnnouncing}
                    />
                }
            >
                {isGroupFetching || isProstavaFetching || !prostavaForm.getValues()?.id ? (
                    <Loading />
                ) : (
                    <ProstavaForm
                        readOnly={prostava?.readonly}
                        disabled={isProstavaAnnouncing}
                        //TODO API
                        prostavaTypes={group?.prostava_types}
                    />
                )}
                <Toast ref={toastRef} />
            </Dialog>
        </FormProvider>
    );
}
