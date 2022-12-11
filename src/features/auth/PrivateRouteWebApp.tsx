import { useUser } from "../../hooks/user";
import { api } from "../../app/services";
import { useEffect } from "react";
import { localeOption } from "primereact/api";

import { Route, RouteProps } from "react-router";
import { Exception } from "../pages/Exception";
import { Loading } from "../pages/Loading";

export function PrivateRouteWebApp({ component, ...rest }: RouteProps) {
    const [login, { isLoading: isLogining, isError: isLoginError, error: loginError }] = api.useLoginWebAppMutation();

    const user = useUser();

    useEffect(() => {
        Telegram.WebApp.ready();
        login(Telegram.WebApp.initData).unwrap();
    }, [login]);

    if (isLogining) {
        return <Loading background />;
    }

    if (isLoginError || !user) {
        console.log(loginError);
        return (
            <Route
                {...rest}
                render={() => (
                    <Exception
                        title={localeOption("auth")["accessDenied"]}
                        detail={localeOption("auth")["noPermissions"]}
                        severity="error"
                        isWebApp={true}
                    />
                )}
            />
        );
    }

    return <Route component={component} {...rest} />;
}
