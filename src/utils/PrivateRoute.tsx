
import { Redirect, Route, RouteProps } from "react-router";
import { useAuth } from "../hooks/auth";

export function PrivateRoute({ component, ...rest }: RouteProps) {
    const { user } = useAuth();

    return user ? (
        <Route {...rest} />
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
