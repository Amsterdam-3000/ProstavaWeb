import React, { useRef, useEffect } from "react";
import classNames from "classnames";

import { useController, useFormContext, useWatch } from "react-hook-form";
import { api, BaseObject } from "../../app/services/prostava";

import { EmojiPickerPanel } from "../emoji/EmojiPickerPanel";
import { Skeleton } from "primereact/skeleton";
import { OverlayPanel } from "primereact/overlaypanel";

interface ImagePickerObjectEmojiProps {
    name: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
}

export function ImagePickerObjectEmoji(props: ImagePickerObjectEmojiProps) {
    const overlayPanelRef = useRef<OverlayPanel>(null);

    const [fetchEmojiPhoto, { data: emojiPhoto, isFetching: isEmojiPhotoFetching }] = api.useLazyGetEmojiPhotoQuery();

    const { getValues, setValue } = useFormContext<BaseObject>();
    const changedEmoji = useWatch({ name: props.name });
    const { field } = useController({ name: props.name });

    useEffect(() => {
        if (!changedEmoji) {
            return;
        }
        fetchEmojiPhoto(changedEmoji);
    }, [changedEmoji, fetchEmojiPhoto]);

    useEffect(() => {
        if (!emojiPhoto) {
            return;
        }
        setValue("photo", emojiPhoto, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
    }, [emojiPhoto, setValue]);

    if (isEmojiPhotoFetching) {
        return (
            <Skeleton
                height="5rem"
                width="5rem"
                shape="circle"
                className={classNames(props.className, "flex-shrink-0")}
            />
        );
    }

    return (
        <div className={classNames(props.className)}>
            <span
                className={classNames("p-component p-image surface-a border-circle p-3 inline-block", {
                    "p-image-preview-container": !props.readOnly && !props.disabled,
                    "p-disabled": props.disabled
                })}
                onClick={
                    !props.readOnly && !props.disabled
                        ? (e) => {
                              overlayPanelRef.current?.toggle(e, null);
                          }
                        : undefined
                }
            >
                <img src={getValues().photo} alt={getValues().name} width="48" height="44" />
                {!props.readOnly && !props.disabled ? (
                    <div className="p-image-preview-indicator text-white">
                        <i className="p-image-preview-icon pi pi-user-edit"></i>
                    </div>
                ) : null}
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
