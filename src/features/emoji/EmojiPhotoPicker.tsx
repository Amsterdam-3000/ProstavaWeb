import React, { useRef } from "react";
import classNames from "classnames";

import { OverlayPanel } from "primereact/overlaypanel";
import { BaseEmoji, Picker } from "emoji-mart";

interface EmojiPhotoPickerProps {
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    readOnly?: boolean;
    disabled?: boolean;
    onSelect: (emoji: string) => void;
}

export function EmojiPhotoPicker(props: EmojiPhotoPickerProps) {
    const emojiPicker = useRef<OverlayPanel>(null);

    const clickPhoto =
        !props.readOnly && !props.disabled
            ? (e: React.MouseEvent<HTMLElement>) => {
                  emojiPicker.current?.toggle(e, null);
              }
            : undefined;
    const selectEmoji = (emojiData: BaseEmoji) => {
        emojiPicker.current?.hide();
        props.onSelect(emojiData.native);
    };

    //TODO size dynamic
    const emojiPickIndicator =
        !props.readOnly && !props.disabled ? (
            <div className="p-image-preview-indicator">
                <i className="p-image-preview-icon pi pi-user-edit text-xl"></i>
            </div>
        ) : null;

    return (
        <div className="emoji-photo-picker">
            <span
                className={classNames("p-component p-image surface-a border-circle p-3 inline-block", {
                    "p-image-preview-container": !props.readOnly && !props.disabled,
                    "p-disabled": props.disabled
                })}
                onClick={clickPhoto}
            >
                <img src={props.src} alt={props.alt} width={props.width} height={props.height} />
                {emojiPickIndicator}
            </span>
            <OverlayPanel ref={emojiPicker} showCloseIcon className="emoji-photo-picker-panel">
                <Picker theme="auto" title="Pick emoji" emoji="point_up" onSelect={selectEmoji} />
            </OverlayPanel>
        </div>
    );
}
