import React from "react";

interface EmojiPhotoStringProps {
    name: string;
    photo: string;
};

export function EmojiPhotoString(props: EmojiPhotoStringProps) {
    return (
        <div className="emoji-photo-string flex">
            <img alt={props.name} src={props.photo} className="mr-1" />
            <span>{props.name}</span>
        </div>
    );
}
