import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";

import { Chips, ChipsProps } from "primereact/chips";
import { Dialog } from "primereact/dialog";
import { BaseEmoji, Picker } from "emoji-mart";
import { BaseObject } from "../../app/services/prostava";

interface EmojiStringChipsProps extends Omit<ChipsProps, "onAdd"> {
    onAdd: (emojiToken: BaseObject) => void;
    readOnly?: boolean;
}

export function EmojiStringChips(props: EmojiStringChipsProps) {
    const inputText = useRef<HTMLInputElement>(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [prostavaTypeText, setProstavaTypeText] = useState<string>();

    const selectEmoji = (emojiData: BaseEmoji) => {
        setShowEmojiPicker(false);
        props.onAdd({
            id: emojiData.native,
            emoji: emojiData.native,
            name: prostavaTypeText!,
            string: `${emojiData.native} ${prostavaTypeText}`
        });
    };

    useEffect(() => {
        if (!inputText) {
            return;
        }
        if (props.readOnly) {
            inputText.current?.classList.add("hidden");
            inputText.current?.parentNode?.parentElement?.classList.add("opacity-100");
        } else {
            inputText.current?.classList.remove("hidden");
            inputText.current?.parentNode?.parentElement?.classList.remove("opacity-100");
        }
    }, [inputText, props]);

    return (
        <React.Fragment>
            <Chips
                {...props}
                onAdd={(e) => {
                    setProstavaTypeText(e.value);
                    setShowEmojiPicker(true);
                }}
                disabled={props.disabled || props.readOnly}
                inputRef={inputText}
            />
            <Dialog
                className="emoji-string-chips-panel"
                visible={showEmojiPicker}
                resizable={false}
                draggable={false}
                header={`New type: ${prostavaTypeText}`}
                onHide={() => {
                    setShowEmojiPicker(false);
                }}
            >
                <Picker theme="auto" title="Pick emoji" emoji="point_up" onSelect={selectEmoji} />
            </Dialog>
        </React.Fragment>
    );
}
