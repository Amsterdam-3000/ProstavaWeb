import React from "react";
import { localeOption } from "primereact/api";
import { useFormContext } from "react-hook-form";
import { User } from "../../app/services";

import { Field } from "../form/Field";
import { InputName } from "../form/InputName";
import { ImagePickerObjectEmoji } from "../form/ImagePickerObjectEmoji";
import { CalendarDateTime } from "../form/CalendarDateTime";
import { Aztro } from "../aztro/Aztro";

interface ProfileFormProps {
    readOnly?: boolean;
    disabled?: boolean;
}

export function ProfileForm(props: ProfileFormProps) {
    const t = localeOption("profile");

    const { getValues } = useFormContext<User>();
    const user = getValues();

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
                        id="user-profile-name"
                        name="name"
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                        required
                    />
                </Field>
            </div>
            <div className="flex flex-column p-fluid">
                <Field label={t["birthday"]}>
                    <CalendarDateTime
                        id="user-profile-birthday"
                        name="birthday"
                        readOnly={props.readOnly}
                        disabled={props.disabled}
                    />
                </Field>
            </div>
            <Aztro birthday={user.birthday} isRoman={new RegExp(/roman/, "i").test(user.name)} />
        </React.Fragment>
    );
}
