import React, { useEffect, useRef } from "react";

import { useHistory } from "react-router";
import { useAppSelector } from "../../hooks/store";
import { api } from "../../app/services/prostava";
import { selectLocation } from "../../app/history";

import logo from "../../assets/images/logo.png";
import background from "../../assets/images/background.png";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

export function Login() {
    const history = useHistory();
    const location = useAppSelector(selectLocation);
    const [login] = api.useLoginMutation();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (!toast.current) {
            return;
        }
        if (!location.state?.error) {
            return;
        }
        toast.current.show({
            severity: "error",
            summary: location.state.error.name,
            detail: location.state.error.message,
            life: 3000,
            contentClassName: ""
        });
    }, [location, toast]);

    async function authHandler(authUser: TUser) {
        try {
            await login(authUser).unwrap();
            history.push(location.state?.from ? location.state.from.pathname : "/");
        } catch (error) {
            console.log(error);
            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "ACCESS DENIED",
                    detail: "You do not have the necessary permissions",
                    life: 3000,
                    contentClassName: ""
                });
            }
        }
    }

    return (
        <div className="login-body grid grid-nogutter h-screen">
            <div className="login-panel col md:col-4 h-full overflow-hidden relative">
                <img src={background} alt="background" className="absolute h-full top-0 left-0 opacity-10 md:hidden" />
                <div className="login-panel-wrapper relative h-full text-center py-6 px-4 flex align-items-center flex-column">
                    <Avatar
                        image={logo}
                        imageAlt={process.env.REACT_APP_BOT_NAME!}
                        className="top-0 left-50 hidden md:block"
                        size="large"
                    />
                    <div className="login-form flex flex-column flex-grow-1 justify-content-center">
                        <h2>Login</h2>
                        <p className="text-secondary mb-5 font-medium">
                            Don't have a Telegram account?{" "}
                            <a href="https://telegram.org/apps" target="_blank" rel="noreferrer">
                                Create
                            </a>
                        </p>
                        <TLoginButton
                            botName={process.env.REACT_APP_BOT_NAME!}
                            buttonSize={TLoginButtonSize.Large}
                            lang="en"
                            usePic={true}
                            cornerRadius={4}
                            onAuthCallback={authHandler}
                            requestAccess={"write"}
                        />
                    </div>
                    <Button
                        label="Add Bot to group"
                        className="p-button-link"
                        onClick={() => {
                            window.open(`https://t.me/${process.env.REACT_APP_BOT_NAME}`, "_blank");
                        }}
                        icon="pi pi-send"
                    ></Button>
                </div>
            </div>
            <div className="login-image md:col-8 h-full hidden md:block overflow-hidden relative">
                <img className="absolute w-full top-0 left-0 opacity-30" src={background} alt="background" />
                <div className="login-image-wrapper py-6 px-4 relative h-full flex align-items-center flex-column">
                    <div className="login-image-content flex-grow-1 flex justify-content-center flex-column">
                        <div className="login-image-text mb-5">
                            <h1>
                                Hi! <br />
                                I’m Prostava
                            </h1>
                            <h5>
                                I can help you control prostavas
                                <br />
                            </h5>
                        </div>
                    </div>
                    <Button
                        label="Show on Github"
                        className="p-button-link font-medium"
                        icon="pi pi-github"
                        onClick={() => {
                            window.open("https://github.com/usebooz/ProstavaBot", "_blank");
                        }}
                    ></Button>
                </div>
            </div>
            <Toast ref={toast} className="w-11 sm:w-30rem" />
        </div>
    );
}
