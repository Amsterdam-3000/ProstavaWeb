import React from "react";
import classNames from "classnames";
import { localeOption } from "primereact/api";
import { useHistory } from "react-router";

import background from "../../assets/images/background.png";

import { Button } from "primereact/button";

interface ExceptionProps {
    title: string;
    detail: string;
    severity?: "success" | "info" | "warning" | "error";
    isWebApp?: boolean;
}

export function Exception(props: ExceptionProps) {
    const history = useHistory();

    return (
        <div className="exception-body relative overflow-hidden h-screen text-center flex align-items-center justify-content-center">
            <div
                className={classNames("absolute h-screen w-screen top-0 left-0 opacity-20", {
                    "bg-green-500": props.severity === "success",
                    "bg-blue-500": props.severity === "info",
                    "bg-yellow-500": props.severity === "warning",
                    "bg-pink-500": props.severity === "error"
                })}
            />
            <img
                src={background}
                alt="prostava-back"
                className="absolute h-full md:h-auto md:w-full top-0 left-0 opacity-10"
                style={{ filter: "blur(4px)" }}
            />

            <div className="exception-content relative">
                <h1 className="exception-title md:text-7xl">{props.title}</h1>
                <p className="exception-detail text-secondary font-medium">{props.detail}</p>
                {!props.isWebApp ? (
                    <Button
                        type="button"
                        label={localeOption("app")["toHome"]}
                        icon="pi pi-home"
                        onClick={(e) => {
                            history.push("/");
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
