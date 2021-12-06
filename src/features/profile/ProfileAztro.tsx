import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { api, User } from "../../app/services";
import { selectStorageLanguage } from "../app/appSlice";

import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "../prime/Avatar";
import { InputText } from "../prime/InputText";

interface ProfileAztroProps {
    birthday?: Date;
}

export function ProfileAztro(props: ProfileAztroProps) {
    const language = useSelector(selectStorageLanguage);

    const [fetchAztro, { data: aztro, isFetching: isAztroFetching }] = api.useLazyGetAztroQuery();

    const { watch } = useFormContext<User>();

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
                    <div className="parallax-stars h-10rem mb-2 border-round-top">
                        <div className="stars"></div>
                        <div className="stars2"></div>
                        <div className="stars3"></div>
                    </div>
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
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.compatibility}
                                        readOnly
                                        className="p-inputtext p-0 border-none mb-2 w-full"
                                    />
                                    <label className="left-0 m-0">Compatibility</label>
                                </div>
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.mood}
                                        readOnly
                                        className="p-inputtext p-0 border-none mb-2 w-full"
                                    />
                                    <label className="left-0 m-0">Mood</label>
                                </div>
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.color}
                                        readOnly
                                        className="p-inputtext p-0 border-none mb-2 w-full"
                                    />
                                    <label className="left-0 m-0">Color</label>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="col-6">
                        {isAztroFetching ? (
                            <Skeleton height="10.5rem" />
                        ) : (
                            <React.Fragment>
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.lucky_number}
                                        readOnly
                                        className="p-inputtext p-0 border-none mb-2 w-full"
                                    />
                                    <label className="left-0 m-0">Lucky number</label>
                                </div>
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.lucky_time}
                                        readOnly
                                        className="p-inputtext p-0 border-none mb-2 w-full"
                                    />
                                    <label className="left-0 m-0">Lucky time</label>
                                </div>
                                <div className="field p-float-label">
                                    <InputText
                                        value={aztro?.stone}
                                        readOnly
                                        className="p-inputtext p-0 border-none  w-full"
                                    />
                                    <label className="left-0 m-0">Stone</label>
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
