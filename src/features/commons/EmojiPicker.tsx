import React, { useRef } from "react";
import classNames from "classnames";

import { OverlayPanel } from "primereact/overlaypanel";
import { Picker } from "emoji-mart";

interface EmojiPickerProps {
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    readOnly?: boolean;
};

export function EmojiPicker(props: EmojiPickerProps) {
    const emojiPicker = useRef<OverlayPanel>(null);

    const handleClick = !props.readOnly
        ? (e: React.MouseEvent<HTMLElement>) => {
              emojiPicker.current?.toggle(e, null);
          }
        : undefined;

    //TODO size dynamic
    const emojiPickIndicator = !props.readOnly ? (
        <div className="p-image-preview-indicator">
            <i className="p-image-preview-icon pi pi-user-edit text-xl"></i>
        </div>
    ) : null;

    return (
        <div className="emoji-picker">
            <span
                className={classNames("p-component p-image surface-a border-circle p-3", {
                    "p-image-preview-container": !props.readOnly
                })}
                onClick={handleClick}
            >
                <img src={props.src} alt={props.alt} width={props.width} height={props.height} />
                {emojiPickIndicator}
            </span>
            <OverlayPanel ref={emojiPicker} showCloseIcon className="emoji-picker-panel">
                <Picker theme="auto" title="Pick emoji" emoji="point_up" />
            </OverlayPanel>
        </div>
    );
}
