import React from "react";
import { TLoginButton, TLoginButtonSize } from "react-telegram-auth";
import { useHistory } from "react-router";

import { useLoginMutation } from "../../app/services/prostava";

export function Login() {
    const [login] = useLoginMutation();
    const history = useHistory();

    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-panel">
                    <img src="assets/icons/apple-touch-icon.png" className="logo" alt="diamond-layout" />
                    <div className="login-form">
                        <h2>Login</h2>
                        <p>
                            Already have an account? <a href="/">Login</a>
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
                                    // Being that the result is handled in extraReducers in authSlice,
                                    // we know that we're authenticated after this, so the user
                                    // and token will be present in the store
                                    history.push("/");
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                            requestAccess={"write"}
                        />
                    </div>
                    <p>
                        A problem? <a href="/">Click here</a> and let us help you.
                    </p>
                </div>
                <div className="login-image">
                    <div className="login-image-content">
                        <h1>Access to your</h1>
                        <h1>Prostava</h1>
                        <h1>Account</h1>
                        <h3>
                            Lorem ipsum dolor sit amet, consectetur <br />
                            adipiscing elit. Donec posuere velit nec enim <br />
                            sodales, nec placerat erat tincidunt.
                        </h3>
                    </div>
                    <div className="image-footer">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <div className="icons">
                            <i className="pi pi-github"></i>
                            <i className="pi pi-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
