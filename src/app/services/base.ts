import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const baseApi = createApi({
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
    tagTypes: ["Groups", "Group", "Users", "Prostavas"],
    endpoints: (builder) => ({})
});
