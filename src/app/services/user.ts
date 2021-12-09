import { BaseObject } from "./base";
import { groupApi } from "./group";

export interface User extends BaseObject {
    birthday?: Date;
}

export const userApi = groupApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], string>({
            query: (groupId) => ({ url: `app/group/${groupId}/users` }),
            providesTags: (result, error, groupId) =>
                result
                    ? [
                          ...result.map((user) => ({ type: "Users", id: `${groupId}/${user.id}` } as const)),
                          { type: "Users", id: groupId }
                      ]
                    : [{ type: "Users", id: groupId }]
        }),

        getUser: builder.query<User, { groupId: string; userId: string }>({
            query: (params) => ({ url: `app/group/${params.groupId}/user/${params.userId}` }),
            providesTags: (result, error, params) => [{ type: "User", id: `${params.groupId}/${params.userId}` }]
        }),

        updateUser: builder.mutation<void, { groupId: string; user: User }>({
            query: (params) => ({
                url: `app/group/${params.groupId}/user/${params.user.id}`,
                method: "PATCH",
                body: params.user
            }),
            invalidatesTags: (result, error, params) => [
                { type: "User", id: `${params.groupId}/${params.user.id}` },
                { type: "Users", id: `${params.groupId}/${params.user.id}` },
                { type: "Prostavas", id: params.groupId }
            ]
        })
    })
});
