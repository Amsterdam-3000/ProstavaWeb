import React, { useEffect } from "react";
import { localeOption } from "primereact/api";
import { api } from "../../app/services";
import { useParamGroupId, useParamProstavaId } from "../../hooks/app";

import { ProstavaCard } from "./ProstavaCard";
import { Loading } from "../pages/Loading";

export function ProstavaCardWebApp() {
    const groupId = useParamGroupId();
    const prostavaId = useParamProstavaId();

    const { data: prostava, isFetching: isProstavaFetching } = api.useGetProstavaQuery(
        {
            groupId: groupId,
            prostavaId: prostavaId
        },
        { skip: !groupId || !prostavaId }
    );

    const [
        withdrawProstava,
        { isLoading: isProstavaWithdrawing, isSuccess: isProstavaWithdrawSuccess, isError: isProstavaWithdrawError }
    ] = api.useWithdrawProstavaMutation();

    const t = localeOption("prostava");

    useEffect(() => {
        Telegram.WebApp.MainButton.setText(t["withdraw"]);
    }, [t]);

    useEffect(() => {
        Telegram.WebApp.MainButton.onClick(() => {
            withdrawProstava({
                groupId: groupId,
                prostavaId: prostavaId,
                fromWebApp: true
            });
        });
    }, [withdrawProstava, groupId, prostavaId]);

    //Show Withdraw button when Form changed
    useEffect(() => {
        if (prostava?.canWithdraw) {
            Telegram.WebApp.MainButton.show();
        } else {
            Telegram.WebApp.MainButton.hide();
        }
    }, [prostava]);

    useEffect(() => {
        if (isProstavaWithdrawing) {
            Telegram.WebApp.MainButton.showProgress(false);
        } else {
            Telegram.WebApp.MainButton.hideProgress();
        }
    }, [isProstavaWithdrawing]);

    // Show message when failed
    useEffect(() => {
        if (isProstavaWithdrawError) {
            Telegram.WebApp.showAlert(t["withdrawFail"]);
        }
    }, [isProstavaWithdrawError, t]);

    // Show Prostava dialog when success
    useEffect(() => {
        if (isProstavaWithdrawSuccess) {
            Telegram.WebApp.close();
            Telegram.WebApp.showAlert(t["withdrawSuccess"]);
        }
    }, [isProstavaWithdrawSuccess, t]);

    if (isProstavaFetching || !prostava) {
        return <Loading />;
    }

    return <ProstavaCard prostava={prostava} isWebApp={true} />;
}
