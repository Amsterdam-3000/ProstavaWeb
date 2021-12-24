import React, { useEffect, useState } from "react";
import PrimeReact, { localeOption } from "primereact/api";
import momentTZ from "moment-timezone";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { useUser } from "../../hooks/user";
import { api, BaseObject, Prostava } from "../../app/services";
import { selectStorageGroupId } from "../app/appSlice";

import { Field } from "../form/Field";
import { InputName } from "../form/InputName";
import { DropdownObject } from "../form/DropdownObject";
import { InputNumberButtons } from "../form/InputNumberButtons";
import { CalendarDateTime } from "../form/CalendarDateTime";
import { AutoCompleteObject } from "../form/AutoCompleteObject";
import { ImagePickerVenueAddress } from "../form/ImagePickerVenueAddress";
import { ProstavaVenueItem } from "./ProstavaVenueItem";

interface ProstavaFormProps {
    readOnly?: boolean;
    disabled?: boolean;
    prostavaTypes?: BaseObject[];
}

export function ProstavaForm(props: ProstavaFormProps) {
    const dispatch = useAppDispatch();
    const groupId = useAppSelector(selectStorageGroupId);
    const userId = useUser()?.id;

    const { getValues, watch } = useFormContext<Prostava>();
    const isRequest = getValues().is_request;

    const { data: users, isFetching: isUsersFetching } = api.useGetUsersQuery(groupId!, { skip: !groupId });
    const { data: currencies, isFetching: isCurrenciesFetching } = api.useGetCurrenciesQuery(PrimeReact.locale);
    const { data: prostavas, isFetching: isProstavasFetching } = api.useGetProstavasQuery(groupId!, {
        skip: !groupId || isRequest
    });

    const [showTime, setShowTime] = useState(false);

    const t = localeOption("prostava");

    let venueIds = new Set();
    const venues = prostavas
        ?.filter((prostava) => {
            if (prostava.venue.name && !venueIds.has(prostava.venue.name)) {
                venueIds.add(prostava.venue.name);
                return true;
            } else {
                return false;
            }
        })
        .map((prostava) => prostava.venue);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "date" && value.date) {
                setShowTime(new Date(value.date).getTime() > Date.now());
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    return (
        <div className="flex flex-column p-fluid">
            {isRequest && (
                <Field label={t["author"]}>
                    <DropdownObject
                        id="prostava-author"
                        name="author"
                        options={users?.filter((user) => user.id !== userId)}
                        showPhoto
                        isObject
                        required
                        loading={isUsersFetching}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
            )}
            <div className="p-inputgroup">
                <Field label={t["type"]} className="max-w-min">
                    <DropdownObject
                        id="prostava-type"
                        name="emoji"
                        options={props.prostavaTypes}
                        showPhoto
                        hideName
                        required
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["name"]}>
                    <InputName
                        id="prostava-name"
                        name="name"
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                        required
                    />
                </Field>
            </div>
            {isRequest || (
                <React.Fragment>
                    <Field label={t["date"]}>
                        <CalendarDateTime
                            id="prostava-date"
                            name="date"
                            required
                            showTime={showTime}
                            readOnly={props.readOnly}
                            disabled={props.disabled}
                        />
                    </Field>
                    {showTime && (
                        <div className="p-inputgroup">
                            <Field label={t["time"]} className="w-5rem">
                                <CalendarDateTime
                                    id="prostava-date"
                                    name="date"
                                    required
                                    timeOnly
                                    readOnly={props.readOnly}
                                    disabled={props.disabled}
                                />
                            </Field>
                            <Field label={t["timezone"]}>
                                <DropdownObject
                                    id="prostava-timezone"
                                    name="timezone"
                                    //TODO Backend?
                                    options={momentTZ.tz.names().map((timezone) => ({ id: timezone, name: timezone }))}
                                    // loading={}
                                    filter
                                    readOnly={props.readOnly}
                                    disabled={props.disabled}
                                />
                            </Field>
                        </div>
                    )}
                    <div className="p-inputgroup">
                        <Field label={t["currency"]} className="max-w-min">
                            <DropdownObject
                                id="prostava-currency"
                                name="currency"
                                options={currencies}
                                showPhoto
                                hideName
                                loading={isCurrenciesFetching}
                                readOnly={props.readOnly}
                                disabled={props.disabled}
                            />
                        </Field>
                        <Field label={t["cost"]}>
                            <InputNumberButtons
                                id="prostava-amount"
                                name="amount"
                                readOnly={props.readOnly}
                                disabled={props.disabled}
                                required
                            />
                        </Field>
                    </div>
                    <Field label={t["venue"]}>
                        <AutoCompleteObject
                            id="prostava-venue"
                            name="venue"
                            suggestions={venues}
                            required
                            isObject
                            readOnly={props.readOnly}
                            disabled={props.disabled}
                            loading={isProstavasFetching}
                            itemTemplate={(venue) => <ProstavaVenueItem venue={venue} />}
                        />
                    </Field>
                    <ImagePickerVenueAddress
                        name="venue"
                        required
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </React.Fragment>
            )}
        </div>
    );
}
