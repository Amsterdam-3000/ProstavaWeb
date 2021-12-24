import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useController, useFormContext } from "react-hook-form";
import { BaseObject } from "../../app/services/base";
import { localeOption } from "primereact/api";

import { Chips, ChipsProps } from "primereact/chips";
import { OverlayPanel } from "primereact/overlaypanel";
import { EmojiPickerPanel } from "../emoji/EmojiPickerPanel";

interface ChipsObjectProps extends ChipsProps {
    name: string;
    readOnly?: boolean;
}

export function ChipsObject(props: ChipsObjectProps) {
    const inputTextRef = useRef<HTMLInputElement>(null);
    const overlayPanelRef = useRef<OverlayPanel>(null);

    const { setError, clearErrors } = useFormContext();
    const { field, fieldState } = useController({
        name: props.name
    });

    const [inputString, setInputString] = useState<string>("");

    useEffect(() => {
        const inputElement = inputTextRef?.current;
        if (!inputElement) {
            return;
        }
        const inputHandler = (e: Event) => {
            if (!inputElement.value || /^\p{L}.*$/u.test(inputElement.value)) {
                clearErrors(field.name);
            } else {
                setError(field.name, {
                    type: "manual",
                    message: localeOption("form")["name"]["mustStartLetter"]
                });
            }
        };
        inputElement.addEventListener("input", inputHandler);
        return () => inputElement.removeEventListener("input", inputHandler);
    }, [inputTextRef, setError, clearErrors, field]);

    useEffect(() => {
        if (!inputTextRef) {
            return;
        }
        if (props.readOnly) {
            inputTextRef.current?.classList.add("hidden");
            inputTextRef.current?.parentNode?.parentElement?.classList.add("opacity-100");
        } else {
            inputTextRef.current?.classList.remove("hidden");
            inputTextRef.current?.parentNode?.parentElement?.classList.remove("opacity-100");
        }
        const list = inputTextRef.current?.parentNode?.parentNode;
        if (!list || props.disabled) {
            return;
        }
        for (let i = 0; i < list.children.length - 1; i++) {
            const chip = list.children[i];
            const chipObject = (field.value as BaseObject[]).find(
                (object) => object.string === chip.firstChild?.textContent
            );
            if (chipObject && chipObject.readonly && chip.children.length > 1) {
                chip.lastElementChild?.classList.add("hidden");
            }
        }
    }, [inputTextRef, props, field]);

    if (field.value === undefined) {
        return null;
    }

    return (
        <React.Fragment>
            <Chips
                {...props}
                value={(field.value as BaseObject[]).map((object) => object.string)}
                onAdd={(e) => {
                    if (fieldState.invalid) {
                        return;
                    }
                    setInputString(e.value);
                    overlayPanelRef.current?.toggle(e.originalEvent, null);
                }}
                onRemove={(e) => {
                    field.onChange((field.value as BaseObject[]).filter((object) => object.string !== e.value[0]));
                }}
                allowDuplicate={false}
                disabled={props.disabled || props.readOnly}
                inputRef={inputTextRef}
                className={classNames(props.className, {
                    "p-invalid": fieldState.invalid
                })}
            />
            <EmojiPickerPanel
                overlayPanelRef={overlayPanelRef}
                title={inputString}
                onSelect={(emoji: string) => {
                    field.onChange([
                        ...(field.value as BaseObject[]),
                        {
                            id: emoji,
                            emoji: emoji,
                            name: inputString,
                            string: `${emoji} ${inputString}`
                        }
                    ]);
                    overlayPanelRef.current?.hide();
                }}
            />
        </React.Fragment>
    );
}
