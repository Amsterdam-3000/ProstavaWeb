import React from "react";

import background from "../../assets/images/background.png";

import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingProps {
    background?: boolean;
}

export function Loading(props: LoadingProps) {
    return (
        <div className="loading-body relative overflow-hidden h-screen flex align-items-center justify-content-center">
            {props.background && (
                <img
                    src={background}
                    alt="prostava-back"
                    className="absolute h-full md:h-auto md:w-full top-0 left-0 opacity-10"
                    style={{ filter: "blur(4px)" }}
                />
            )}
            <div className="loading-content relative">
                <ProgressSpinner />
            </div>
        </div>
    );
}
