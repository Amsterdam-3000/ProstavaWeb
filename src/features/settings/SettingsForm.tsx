import React, { useCallback, useEffect } from "react";
import { localeOption } from "primereact/api";
import momentTZ from "moment-timezone";
import { useFormContext } from "react-hook-form";
import { useAppDispatch } from "../../hooks/store";
import { api, Group } from "../../app/services";
import { setLanguage } from "../app/appSlice";

import { Field } from "../form/Field";
import { InputName } from "../form/InputName";
import { ImagePickerObjectEmoji } from "../form/ImagePickerObjectEmoji";
import { DropdownObject } from "../form/DropdownObject";
import { InputNumberButtons } from "../form/InputNumberButtons";
import { InputNumberSlider } from "../form/InputNumberSlider";
import { ChipsObject } from "../form/ChipsObject";

interface SettingsFormProps {
    language?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export function SettingsForm(props: SettingsFormProps) {
    const dispatch = useAppDispatch();

    const [fetchLanguages, { data: languages, isFetching: isLanguagesFetching }] = api.useLazyGetLanguagesQuery();
    const [fetchCurrencies, { data: currencies, isFetching: isCurrenciesFetching }] = api.useLazyGetCurrenciesQuery();

    const { getValues, watch } = useFormContext<Group>();
    const group = getValues();

    const t = localeOption("settings");

    const fetchLocale = useCallback(
        (language: string) => {
            fetchLanguages(language, true);
            fetchCurrencies(language, true);
        },
        [fetchLanguages, fetchCurrencies]
    );

    useEffect(() => {
        if (props.language) {
            fetchLocale(props.language);
        }
    }, [props.language, fetchLocale]);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "language") {
                dispatch(setLanguage(value.language!));
                fetchLocale(value.language!);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, fetchLocale, dispatch]);

    return (
        <React.Fragment>
            <div className="flex p-fluid mb-3">
                <ImagePickerObjectEmoji
                    name="emoji"
                    readOnly={props.readOnly}
                    disabled={props.disabled}
                    className="mr-2 align-self-center"
                />
                <Field label={t["name"]} className="w-full">
                    <InputName
                        id="group-settings-name"
                        name="name"
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                        required
                    />
                </Field>
            </div>
            <div className="flex flex-column p-fluid">
                <Field label={t["language"]}>
                    <DropdownObject
                        id="group-settings-language"
                        name="language"
                        options={languages}
                        showPhoto
                        loading={isLanguagesFetching}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["currency"]}>
                    <DropdownObject
                        id="group-settings-currency"
                        name="currency"
                        options={currencies}
                        showPhoto
                        loading={isCurrenciesFetching || isLanguagesFetching}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["timezone"]}>
                    <DropdownObject
                        id="group-settings-timezone"
                        name="timezone"
                        //TODO Backend?
                        options={momentTZ.tz.names().map((timezone) => ({ id: timezone, name: timezone }))}
                        // loading={}
                        filter
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["prostavaTypes"]}>
                    <ChipsObject
                        id="group-settings-types"
                        name="prostava_types"
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["daysBefore"]}>
                    <InputNumberButtons
                        id="group-settings-days"
                        name="create_days_ago"
                        prefix={`${t["expiresIn"]} `}
                        suffix={` ${t["days"]}`}
                        min={0}
                        max={9999}
                        allowEmpty={false}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["hoursComplete"]}>
                    <InputNumberButtons
                        id="group-settings-hours"
                        name="pending_hours"
                        prefix={`${t["completedIn"]} `}
                        suffix={` ${t["hours"]}`}
                        min={0}
                        max={999}
                        allowEmpty={false}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["participantsNumber"]}>
                    <InputNumberSlider
                        id="group-settings-count"
                        name="chat_members_count"
                        suffix={` ${t["participantsOutOf"]} ${group.chat_members_all} ${t["members"]}`}
                        min={0}
                        max={group.chat_members_all}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
                <Field label={t["participantsMinimum"]}>
                    <InputNumberSlider
                        id="group-settings-percent"
                        name="participants_min_percent"
                        suffix={`% ${t["approvalRequired"]}`}
                        min={0}
                        max={100}
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
            </div>
        </React.Fragment>
    );
}
