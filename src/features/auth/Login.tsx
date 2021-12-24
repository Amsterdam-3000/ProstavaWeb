import React, { useEffect, useRef } from "react";
import PrimeReact, { localeOption } from "primereact/api";
import { useHistory } from "react-router";
import { useAppSelector } from "../../hooks/store";
import { api } from "../../app/services";
import { selectLocation } from "../../app/history";

import logo from "../../assets/images/logo.png";
import background from "../../assets/images/background.png";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Avatar } from "../prime/Avatar";

export function Login() {
    const history = useHistory();

    const location = useAppSelector(selectLocation);

    const [login] = api.useLoginMutation();

    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        if (toastRef.current && location.state?.message) {
            toastRef.current.show({
                severity: location.state.message.severity,
                summary: location.state.message.summary,
                detail: location.state.message.detail
            });
        }
    }, [location, toastRef]);

    async function loginHandler(authUser: TUser) {
        try {
            await login(authUser).unwrap();
            history.push(location.state?.from ? location.state.from.pathname : "/");
        } catch (error) {
            console.log(error);
            if (toastRef.current) {
                toastRef.current.show({
                    severity: "error",
                    summary: localeOption("auth")["accessDenied"],
                    detail: localeOption("auth")["noPermissions"]
                });
            }
        }
    }

    return (
        <div className="login-body grid grid-nogutter h-screen">
            <div className="login-panel col md:col-4 h-full overflow-hidden relative">
                <img
                    src={background}
                    alt="background"
                    className="absolute h-full top-0 left-0 opacity-10 md:hidden"
                    style={{ filter: "blur(4px)" }}
                />
                <div className="login-panel-wrapper relative h-full text-center py-6 px-4 flex align-items-center flex-column">
                    <Avatar
                        image={logo}
                        imageAlt={process.env.REACT_APP_BOT_NAME!}
                        className="top-0 left-50 hidden md:block"
                        size="large"
                    />
                    <div className="login-form flex flex-column flex-grow-1 justify-content-center">
                        <h2>{localeOption("login")}</h2>
                        <p className="text-secondary mb-5 font-medium">
                            {localeOption("auth")["noTelegram?"]}{" "}
                            <a href="https://telegram.org/apps" target="_blank" rel="noreferrer">
                                {localeOption("create")}
                            </a>
                        </p>
                        <TLoginButton
                            botName={process.env.REACT_APP_BOT_NAME!}
                            buttonSize={TLoginButtonSize.Large}
                            lang={PrimeReact.locale}
                            usePic={true}
                            cornerRadius={4}
                            onAuthCallback={loginHandler}
                            requestAccess={"write"}
                        />
                    </div>
                    <Button
                        label={process.env.REACT_APP_BOT_NAME!}
                        tooltip={localeOption("auth")["addBot"]}
                        tooltipOptions={{ position: "top" }}
                        className="p-button-text p-button-info"
                        onClick={() => {
                            window.open(`https://t.me/${process.env.REACT_APP_BOT_NAME}`, "_blank");
                        }}
                        icon="pi pi-telegram"
                    ></Button>
                </div>
            </div>
            <div className="login-image md:col-8 h-full hidden md:block overflow-hidden relative">
                <img
                    className="absolute w-full top-0 left-0 opacity-30"
                    src={background}
                    alt="background"
                    style={{ filter: "blur(2px)" }}
                />
                <div className="login-image-wrapper py-6 px-4 relative h-full flex align-items-center flex-column">
                    <div className="login-image-content flex-grow-1 flex justify-content-center flex-column">
                        <div className="login-image-text mb-5">
                            <h1>
                                {localeOption("auth")["hi!"]}
                                <br />
                                {localeOption("auth")["iProstava"]}
                            </h1>
                            <h5>
                                {localeOption("auth")["helpProstava"]}
                                <br />
                            </h5>
                        </div>
                    </div>
                    <Button
                        label={process.env.REACT_APP_BOT_NAME!}
                        tooltip={localeOption("auth")["showGitgub"]}
                        tooltipOptions={{ position: "top" }}
                        className="p-button-link"
                        icon="pi pi-github"
                        onClick={() => {
                            window.open("https://github.com/usebooz/ProstavaBot", "_blank");
                        }}
                    ></Button>
                </div>
            </div>
            <Toast ref={toastRef} />
        </div>
    );
}
