import { TUser } from "react-telegram-auth";
import { baseApi } from "./base";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginApp: builder.mutation<string, TUser>({
            query: (authUser) => ({
                url: "auth/login/app",
                method: "POST",
                body: authUser
            })
        }),
        loginWebApp: builder.mutation<string, string>({
            query: (initData) => ({
                url: "auth/login/webapp",
                method: "POST",
                body: { initData: initData }
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
