import React from "react";
import { useHistory } from "react-router";
import { TLoginButton, TLoginButtonSize } from "react-telegram-auth";

import { useLoginMutation } from "../../app/services/prostava";

export function Login() {
    const [login] = useLoginMutation();
    const history = useHistory();

    return (
        <div className="login-wrapper grid grid-nogutter h-screen">
            <div className="login-panel col md:col-4 h-full py-6 px-4 text-center flex align-items-center justify-content-between flex-column">
                <img src="assets/icons/apple-touch-icon.png" className="logo h-4rem border-round" alt="prostava-logo" />
                <div className="login-form flex align-items-center flex-column">
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
                        cornerRadius={20}
                        onAuthCallback={async (authUser) => {
                            try {
                                await login(authUser);
                                history.push("/");
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        requestAccess={"write"}
                    />
                </div>
                <p className="text-secondary font-medium">
                    Add{" "}
                    <a href={`https://t.me/${process.env.REACT_APP_BOT_NAME}`} target="_blank" rel="noreferrer">
                        {process.env.REACT_APP_BOT_NAME}
                    </a>{" "}
                    to your groups
                </p>
            </div>
            <div className="login-image md:col-8 h-full hidden md:block overflow-hidden relative">
                <img
                    className="absolute w-full top-0 left-0 opacity-30"
                    src="assets/images/ProstavaBot2.png"
                    alt="prostava-back"
                />
                <div className="login-image-wrapper py-6 px-4 relative h-full flex align-items-center flex-column">
                    <div className="login-image-content flex-grow-1 flex justify-content-center flex-column">
                        <div className="login-image-text mb-5">
                            <h1>
                                Hi! <br />
                                I’m Prostava
                            </h1>
                            <h3>
                                I can help you control prostavas
                                <br />
                            </h3>
                        </div>
                    </div>
                    <div className="image-footer flx align-cotent-center">
                        <p className="text-secondary font-medium">
                            {process.env.REACT_APP_BOT_NAME}{" "}
                            <a
                                href="https://github.com/usebooz/ProstavaBot"
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary"
                            >
                                <i className="pi pi-github text-lg"></i>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
