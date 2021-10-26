import * as React from "react";
import { ImageProps } from "primereact/image";

export interface ImagePropsFix extends Omit<ImageProps, "preview"> {
    preview?: boolean;
}

export declare class Image extends React.Component<ImagePropsFix, any> {}
