import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import { localeOption } from "primereact/api";

import { OverlayPanel, OverlayPanelProps } from "primereact/overlaypanel";
import { BaseEmoji, Picker, PickerProps } from "emoji-mart";

interface EmojiPickerPanelProps extends OverlayPanelProps {
    onSelect: (emoji: string) => void;
    overlayPanelRef?: React.LegacyRef<OverlayPanel>;
    title?: string;
}

export function EmojiPickerPanel(props: EmojiPickerPanelProps) {
    return (
        <OverlayPanel
            {...props}
            ref={props.overlayPanelRef}
            className={classNames(props.className, "emoji-picker-panel")}
        >
            <EmojiPicker
                theme="auto"
                emoji="point_up"
                title={props.title}
                onSelect={(emoji: BaseEmoji) => {
                    props.onSelect(emoji.native);
                }}
                i18n={localeOption("emoji")}
            />
        </OverlayPanel>
    );
}

function EmojiPicker(props: PickerProps) {
    const divRef = useRef<HTMLDivElement>(null);
    //TODO Fix error when click panel content
    useEffect(() => {}, [divRef]);
    return (
        <div ref={divRef}>
            <Picker {...props} />
        </div>
    );
}
