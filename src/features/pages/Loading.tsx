import React from "react";

import background from "../../assets/images/background.png";

import { ProgressSpinner } from "primereact/progressspinner";

export function Loading() {
    return (
        <div className="loading-body relative overflow-hidden h-screen flex align-items-center justify-content-center">
            <img
                src={background}
                alt="prostava-back"
                className="absolute h-full md:h-auto md:w-full top-0 left-0 opacity-10"
            />
            <div className="loading-content relative">
                <ProgressSpinner />
            </div>
        </div>
    );
}
