import React from "react";

import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../../app/services/prostava";
import { selectLocation } from "../../app/history";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";

export function Login() {
    const history = useHistory();
    const location = useSelector(selectLocation);
    const [login] = useLoginMutation();

    async function authHandler(authUser: TUser) {
        try {
            await login(authUser);
            history.push(location.state ? location.state.from.pathname : "/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="login-body grid grid-nogutter h-screen">
            <div className="login-panel col md:col-4 h-full overflow-hidden relative">
                <img
                    src="assets/images/ProstavaBot2.png"
                    alt="prostava-back"
                    className="absolute h-full top-0 left-0 opacity-10 md:hidden"
                />
                <div className="login-panel-wrapper relative h-full text-center py-6 px-4 flex align-items-center flex-column">
                    <img
                        src="assets/icons/apple-touch-icon.png"
                        alt="prostava-logo"
                        className="h-3rem border-round top-0 left-50 ml-4 hidden md:block"
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
                            cornerRadius={20}
                            onAuthCallback={authHandler}
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
                            <h5>
                                I can help you control prostavas
                                <br />
                            </h5>
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
