import React from "react";

import { useHistory } from "react-router";

import { Button } from "primereact/button";

type ExceptionProps = {
    title: string;
    detail: string;
};

export function Exception(props: ExceptionProps) {
    const history = useHistory();

    return (
        <div className="exception-body relative overflow-hidden h-screen text-center flex align-items-center justify-content-center">
            <img
                src="assets/images/ProstavaBot2.png"
                alt="prostava-back"
                className="absolute h-full md:h-auto md:w-full top-0 left-0 opacity-10"
            />

            <div className="exception-content relative">
                <h1 className="exception-title md:text-7xl">{props.title}</h1>
                <p className="exception-detail text-secondary font-medium">{props.detail}</p>
                <Button label="Go to Dashboard" icon="pi pi-home" onClick={() => history.push("/")} />
            </div>
        </div>
    );
}
