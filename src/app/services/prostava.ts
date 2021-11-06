import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TUser } from "react-telegram-auth";

import { RootState } from "../store";

export interface BaseObject {
    id: string;
    name: string;
    link?: string;
    emoji?: string;
    photo?: string;
    string?: string;
    readonly?: boolean;
}

export type BaseObjectProperty = keyof BaseObject;

export interface Group extends BaseObject {
    language: string;
    currency: string;
    prostava_types: BaseObject[];
    timezone: string;
    create_days_ago: number;
    chat_members_count: number;
    chat_members_all: number;
    participants_min_percent: number;
    pending_hours: number;
    calendar_apple: string;
    calendar_google: string;
}

export interface User extends BaseObject {
    link: string;
    //  TODO isAdmin?
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BOT_API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["Groups", "Group"],
    endpoints: (builder) => ({
        //Auth
        login: builder.mutation<string, TUser>({
            query: (authUser) => ({
                url: "auth/login",
                method: "POST",
                body: authUser
            })
        }),
        //TODO logout

        //Group
        getGroups: builder.query<Group[], void>({
            query: () => ({ url: "app/groups" }),
            providesTags: (result) =>
                //TODO MB Del?
                result
                    ? [
                          ...result.map((group) => ({ type: "Groups", id: group.id } as const)),
                          { type: "Groups", id: "LIST" }
                      ]
                    : [{ type: "Groups", id: "LIST" }]
        }),
        getGroup: builder.query<Group, string>({
            query: (groupId) => ({ url: `app/group/${groupId}` }),
            providesTags: (result, error, groupId) => [{ type: "Group", id: groupId }]
        }),
        updateGroup: builder.mutation<void, Group>({
            query: (group) => ({
                url: `app/group/${group.id}`,
                method: "PATCH",
                body: group
            }),
            invalidatesTags: (result, error, group) => [
                { type: "Group", id: group.id },
                { type: "Groups", id: group.id }
            ]
            //TODO ???DELETE???
            // onQueryStarted(group, { dispatch, queryFulfilled }) {
            //     const patchResult = dispatch(
            //         api.util.updateQueryData("getGroup", group.id, (draft) => {
            //             Object.assign(draft, group);
            //         })
            //     );
            //     queryFulfilled.catch(patchResult.undo);
            // }
        }),

        //User
        getGroupUsers: builder.query<User[], string>({
            query: (groupId) => ({ url: `app/group/${groupId}/users` })
        }),
        getGroupUser: builder.query<User, { groupId: string; userId: string }>({
            query: (params) => ({ url: `app/group/${params.groupId}/user/${params.userId}` })
        }),

        //Global
        getLanguages: builder.query<BaseObject[], string>({
            query: (language) => ({ url: `global/${language}/languages` }),
            //TODO New Lang Tag?
            providesTags: (result, error) => ["Group"]
        }),
        getCurrencies: builder.query<BaseObject[], string>({
            query: (language) => ({ url: `global/${language}/currencies` }),
            //TODO New Lang Tag?
            providesTags: (result, error) => ["Group"]
        }),
        getEmojiPhoto: builder.query<string, string>({
            query: (emoji) => ({ url: `global/emojiPhoto/${emoji}` })
        })
    })
});
