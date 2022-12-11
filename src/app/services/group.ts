import { BaseObject } from "./base";
import { globalApi } from "./global";

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

export const groupApi = globalApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query<Group[], void>({
            query: () => ({ url: "app/groups" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((group) => ({ type: "Groups", id: group.id } as const)),
                          { type: "Groups", id: "ALL" }
                      ]
                    : [{ type: "Groups", id: "ALL" }]
        }),

        getGroup: builder.query<Group, string>({
            query: (groupId) => ({ url: `app/group/${groupId}` }),
            providesTags: (result, error, groupId) => [{ type: "Group", id: groupId }]
        }),

        updateGroup: builder.mutation<void, { group: Group; fromWebApp?: boolean }>({
            query: (params) => ({
                url: `app/group/${params.group.id}`,
                method: "PATCH",
                params: { fromWebApp: params.fromWebApp },
                body: params.group
            }),
            invalidatesTags: (result, error, params) => [
                { type: "Group", id: params.group.id },
                { type: "Groups", id: params.group.id }
            ]
        })
    })
});
