import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TUser } from "react-telegram-auth";

import { RootState } from "../store";

export type Group = {
    id: number;
    name: string;
    photo: string;
};

export type User = {
    id: number;
    name: string;
    photo: string;
    link: string;
};

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BOT_API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
                headers.set("test", "test");
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<string, TUser>({
            query: (authUser) => ({
                url: "auth/login",
                method: "POST",
                body: authUser
            })
        }),
        getGroups: builder.query<Group[], void>({
            query: () => ({ url: "app/groups" })
        }),
        getGroup: builder.query<Group, number>({
            query: (groupId) => ({ url: `app/group/${groupId}` })
        }),
        getGroupUsers: builder.query<User[], number>({
            query: (groupId) => ({ url: `app/group/${groupId}/users` })
        }),
        getGroupUser: builder.query<User, { groupId: number; userId: number }>({
            query: (params) => ({ url: `app/group/${params.groupId}/user/${params.userId}` })
        })
    })
});
