import React, { useEffect, useMemo } from "react";
import { localeOption } from "primereact/api";
import { useForm, useFormState, FormProvider } from "react-hook-form";
import { useParamGroupId, useParamProstavaId } from "../../hooks/app";
import { api } from "../../app/services";

import { Loading } from "../pages/Loading";
import { ProstavaForm } from "./ProstavaForm";

export function ProstavaWebApp() {
    const groupId = useParamGroupId();
    const prostavaId = useParamProstavaId();

    const { data: group, isFetching: isGroupFetching } = api.useGetGroupQuery(groupId, { skip: !groupId });
    const { data: prostava, isFetching: isProstavaFetching } = api.useGetProstavaQuery(
        {
            groupId: groupId,
            prostavaId: prostavaId
        },
        { skip: !groupId || !prostavaId }
    );

    const [
        announceProstava,
        { isLoading: isProstavaAnnouncing, isSuccess: isProstavaAnnounceSuccess, isError: isProstavaAnnounceError }
    ] = api.useAnnounceProstavaMutation();

    const t = localeOption("prostava");

    const prostavaForm = useForm({
        defaultValues: useMemo(() => {
            return prostava;
        }, [prostava]),
        mode: "onChange"
    });
    const { isValid } = useFormState({ control: prostavaForm.control });

    useEffect(() => {
        Telegram.WebApp.MainButton.setText(t["announce"]);
    }, [prostava, t]);

    useEffect(() => {
        Telegram.WebApp.MainButton.onClick(
            prostavaForm.handleSubmit((prostava) => {
                announceProstava({
                    groupId: groupId,
                    prostavaId: prostavaId,
                    prostava: prostava,
                    fromWebApp: true
                });
            })
        );
    }, [announceProstava, groupId, prostavaId, prostavaForm]);

    //Sync Form with prostava
    useEffect(() => {
        prostavaForm.reset(prostava);
    }, [prostava, prostavaForm]);

    //Show Save button when Form changed
    useEffect(() => {
        if (!isGroupFetching && !isProstavaFetching && !prostava?.readonly && isValid) {
            Telegram.WebApp.MainButton.show();
        } else {
            Telegram.WebApp.MainButton.hide();
        }
    }, [isGroupFetching, isProstavaFetching, prostava?.readonly, isValid]);

    useEffect(() => {
        if (isProstavaAnnouncing) {
            Telegram.WebApp.MainButton.showProgress(false);
        } else {
            Telegram.WebApp.MainButton.hideProgress();
        }
    }, [isProstavaAnnouncing]);

    useEffect(() => {
        if (isProstavaAnnounceError) {
            Telegram.WebApp.showAlert(t["announceFail"]);
        }
    }, [isProstavaAnnounceError, t]);

    useEffect(() => {
        if (isProstavaAnnounceSuccess) {
            Telegram.WebApp.close();
            Telegram.WebApp.showAlert(t["announceSuccess"]);
        }
    }, [isProstavaAnnounceSuccess, t]);

    if (isGroupFetching || isProstavaFetching) {
        return <Loading />;
    }

    return (
        <FormProvider {...prostavaForm}>
            <ProstavaForm
                readOnly={prostava?.readonly}
                disabled={isProstavaAnnouncing}
                //TODO API
                prostavaTypes={group?.prostava_types}
            />
        </FormProvider>
    );
}
