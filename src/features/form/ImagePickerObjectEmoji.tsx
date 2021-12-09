import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import { useController, useFormContext } from "react-hook-form";
import { api, BaseObject } from "../../app/services";

import { OverlayPanel } from "primereact/overlaypanel";
import { EmojiPickerPanel } from "../emoji/EmojiPickerPanel";
import { Avatar } from "../prime/Avatar";

interface ImagePickerObjectEmojiProps {
    name: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
}

export function ImagePickerObjectEmoji(props: ImagePickerObjectEmojiProps) {
    const overlayPanelRef = useRef<OverlayPanel>(null);

    const [fetchEmojiPhoto, { data: emojiPhoto, isFetching: isEmojiPhotoFetching }] = api.useLazyGetEmojiPhotoQuery();

    const { field } = useController({ name: props.name });
    const { getValues, setValue, watch } = useFormContext<BaseObject>();

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "emoji") {
                fetchEmojiPhoto(value.emoji!, true);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [watch, fetchEmojiPhoto]);

    useEffect(() => {
        if (!emojiPhoto) {
            return;
        }
        setValue("photo", emojiPhoto, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true
        });
    }, [emojiPhoto, setValue]);

    return (
        <div className={classNames(props.className)}>
            <span className="p-image-preview-containr">
                <Avatar
                    image={getValues().photo}
                    imageAlt={getValues().name}
                    imageHasBackground
                    shape="circle"
                    size="xlarge"
                    disabled={props.disabled}
                    onClick={
                        !props.readOnly && !props.disabled
                            ? (e) => {
                                  overlayPanelRef.current?.toggle(e, null);
                              }
                            : undefined
                    }
                    edit
                    loading={isEmojiPhotoFetching}
                />
            </span>
            <EmojiPickerPanel
                overlayPanelRef={overlayPanelRef}
                title={getValues().name}
                showCloseIcon
                onSelect={(emoji: string) => {
                    overlayPanelRef.current?.hide();
                    field.onChange(emoji);
                }}
            />
        </div>
    );
}
