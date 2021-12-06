import { TUser } from "react-telegram-auth";
import { baseApi } from "./base";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<string, TUser>({
            query: (authUser) => ({
                url: "auth/login",
                method: "POST",
                body: authUser
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST"
            })
        })
    })
});
