import React, { useEffect } from "react";
import { localeOption } from "primereact/api";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../hooks/store";
import { api, User } from "../../app/services";
import { selectStorageLanguage } from "../app/appSlice";

import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "../prime/Avatar";
import { Stars } from "./Stars";
import { Roman } from "./Roman";

interface AztroProps {
    birthday?: Date;
    isRoman?: boolean;
}

export function Aztro(props: AztroProps) {
    const language = useAppSelector(selectStorageLanguage);

    const [fetchAztro, { data: aztro, isFetching: isAztroFetching }] = api.useLazyGetAztroQuery();

    const { watch } = useFormContext<User>();

    const t = localeOption("aztro");

    useEffect(() => {
        fetchAztro({ language: language, birthday: props.birthday! }, true);
    }, [language, props.birthday, fetchAztro]);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "birthday") {
                fetchAztro({ language: language, birthday: value.birthday! }, true);
            }
        });
        return () => subscription.unsubscribe();
    }, [language, watch, fetchAztro]);

    return (
        <Card
            header={
                <React.Fragment>
                    {props.isRoman ? (
                        <Roman className="h-10rem mb-2 border-round-top" />
                    ) : (
                        <Stars className="h-10rem mb-2 border-round-top" />
                    )}
                    <div className="w-full flex justify-content-center -mt-6">
                        {isAztroFetching ? (
                            <Skeleton width="5rem" height="5rem" borderRadius="10px" className="z-1" />
                        ) : (
                            <Avatar image={aztro?.photo} imageAlt={aztro?.name} size="xlarge" className="z-1" />
                        )}
                    </div>
                </React.Fragment>
            }
            title={isAztroFetching ? <Skeleton height="1.8rem" width="50%" /> : aztro?.name}
            subTitle={isAztroFetching ? <Skeleton height="1.25rem" width="75%" /> : aztro?.current_date}
            footer={
                <div className="grid ">
                    <div className="col-6">
                        {isAztroFetching ? (
                            <Skeleton height="10.5rem" />
                        ) : (
                            <React.Fragment>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0">{t["compatibility"]}</label>
                                    <span className="capitalize">{aztro?.compatibility}</span>
                                </div>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0">{t["mood"]}</label>
                                    <span className="capitalize">{aztro?.mood}</span>
                                </div>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0" htmlFor="">
                                        {t["color"]}
                                    </label>
                                    <span className="capitalize">{aztro?.color}</span>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="col-6">
                        {isAztroFetching ? (
                            <Skeleton height="10.5rem" />
                        ) : (
                            <React.Fragment>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0">{t["luckyNumber"]}</label>
                                    <span className="capitalize">{aztro?.lucky_number}</span>
                                </div>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0">{t["luckyTime"]}</label>
                                    <span className="capitalize">{aztro?.lucky_time}</span>
                                </div>
                                <div className="field flex flex-column">
                                    <label className="text-xs text-secondary m-0">{t["stone"]}</label>
                                    <span className="capitalize">{aztro?.stone}</span>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            }
            className="surface-a"
        >
            {isAztroFetching ? <Skeleton height="8rem" /> : aztro?.description}
        </Card>
    );
}
