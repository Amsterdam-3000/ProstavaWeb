import React from "react";

interface EmojiStringProps {
    name: string;
    photo: string;
};

export function EmojiString(props: EmojiStringProps) {
    return (
        <div className="emoji-string flex">
            <img alt={props.name} src={props.photo} className="mr-1" />
            <span>{props.name}</span>
        </div>
    );
}
