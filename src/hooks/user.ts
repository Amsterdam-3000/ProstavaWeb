import jwtDecode from "jwt-decode";
import { useMemo } from "react";
import { useAppSelector } from "./store";

import { selectCurrentToken } from "../features/auth/authSlice";

type User = {
    id: string;
    first_name: string;
    last_name?: string | undefined;
    username?: string | undefined;
    photo_url?: string | undefined;
    iat: number;
    exp: number;
};

export const useUser = () => {
    const currentToken = useAppSelector(selectCurrentToken);
    const getUser = (token: string | null) => {
        let user: User | null = null;
        if (token) {
            user = jwtDecode(token);
        }
        if (user && Number(`${user.exp}000`) <= Date.now()) {
            user = null;
        }
        if (user?.id) {
            user.id = user?.id.toString();
        }
        return user;
    };
    return useMemo(() => getUser(currentToken), [currentToken]);
};
