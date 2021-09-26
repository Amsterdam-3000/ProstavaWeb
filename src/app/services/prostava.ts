import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TUser } from "react-telegram-auth";

import { RootState } from "../store";

export interface User {
    first_name: string;
    last_name?: string | undefined;
    id: number;
    photo_url?: string | undefined;
    username?: string | undefined;
}

export interface Auth {
    user: User;
    token: string;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BOT_API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<Auth, TUser>({
            query: (authUser) => ({
                url: "login",
                method: "POST",
                body: authUser
            })
        }),
        protected: builder.mutation<{ message: string }, void>({
            query: () => "protected"
        })
    })
});

export const { useLoginMutation, useProtectedMutation } = api;
