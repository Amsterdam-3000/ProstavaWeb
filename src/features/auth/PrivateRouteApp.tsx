import { useUser } from "../../hooks/user";

import { Redirect, Route, RouteProps } from "react-router";

export function PrivateRouteApp({ component, ...rest }: RouteProps) {

    const user = useUser();

    return user ? (
        <Route component={component} {...rest} />
    ) : (
        <Route
            {...rest}
            render={({ location }) => (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                />
            )}
        />
    );
}
