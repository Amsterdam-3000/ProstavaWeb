import React from "react";

import { User } from "../../app/services";

import { Field } from "../form/Field";
import { InputName } from "../form/InputName";
import { ImagePickerObjectEmoji } from "../form/ImagePickerObjectEmoji";
import { CalendarDateButton } from "../form/CalendarDateButton";
import { ProfileAztro } from "./ProfileAztro";

interface ProfileContentProps {
    user: User;
    disabled: boolean;
}

export function ProfileContent(props: ProfileContentProps) {
    return (
        <React.Fragment>
            <div className="flex p-fluid mb-3">
                <ImagePickerObjectEmoji
                    name="emoji"
                    readOnly={props.user.readonly}
                    disabled={props.disabled}
                    className="mr-2 align-self-center"
                />
                <Field label="User name" className="w-full">
                    <InputName
                        id="user-profile-name"
                        name="name"
                        readOnly={props.user.readonly}
                        disabled={props.disabled}
                    />
                </Field>
            </div>
            <div className="flex flex-column p-fluid">
                <Field label="Birthday">
                    <CalendarDateButton
                        id="user-profile-birthday"
                        name="birthday"
                        readOnly={props.user.readonly}
                        disabled={props.disabled}
                    />
                </Field>
            </div>
            <ProfileAztro birthday={props.user.birthday} />
        </React.Fragment>
    );
}
