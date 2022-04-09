import { BaseObject } from "./base";
import { userApi } from "./user";

export enum ProstavaStatus {
    New = "new",
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

export interface ProstavaVenue extends BaseObject {
    address: string;
    longitude: number;
    latitude: number;
}

export interface ProstavaParticipant {
    user: BaseObject;
    rating: number;
}

export interface Prostava extends BaseObject {
    author: BaseObject;
    status: ProstavaStatus;
    creator: BaseObject;
    is_request: boolean;
    is_preview: boolean;
    rating: number;
    date: Date;
    timezone: string;
    venue: ProstavaVenue;
    amount?: number;
    currency?: string;
    participants?: ProstavaParticipant[];
    participants_min_count?: number;
    participants_max_count?: number;
    creation_date?: Date;
    closing_date?: Date;
    canWithdraw?: boolean;
    canRate?: boolean;
}

export const prostavaApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        getProstavas: builder.query<Prostava[], string>({
            query: (groupId) => ({ url: `app/group/${groupId}/prostavas` }),
            providesTags: (result, error, groupId) =>
                result
                    ? [
                          ...result.map((prostava) => ({ type: "Prostavas", id: prostava.id } as const)),
                          { type: "Prostavas", id: groupId }
                      ]
                    : [{ type: "Prostavas", id: groupId }]
        }),

        getProstava: builder.query<Prostava, { groupId: string; prostavaId?: string; isRequest?: boolean }>({
            query: (params) => ({
                url:
                    `app/group/${params.groupId}/prostava` +
                    ((params.prostavaId && `/${params.prostavaId}`) || "") +
                    ((params.isRequest && "?isRequest=true") || "")
            }),
            providesTags: (prostava, error, params) => [{ type: "Prostavas", id: params.prostavaId || prostava?.id }]
        }),

        announceProstava: builder.mutation<void, { groupId: string; prostavaId: string; prostava: Prostava }>({
            query: ({ groupId, prostavaId, prostava }) => ({
                url: `app/group/${groupId}/prostava/${prostava.id}/announce`,
                method: "PUT",
                body: prostava
            }),
            invalidatesTags: (result, error, { groupId, prostavaId }) => [
                { type: "Prostavas", id: prostavaId || groupId }
            ]
        }),
        withdrawProstava: builder.mutation<void, { groupId: string; prostavaId: string }>({
            query: ({ groupId, prostavaId }) => ({
                url: `app/group/${groupId}/prostava/${prostavaId}/withdraw`,
                method: "PUT"
            }),
            invalidatesTags: (result, error, { groupId, prostavaId }) => [{ type: "Prostavas", id: prostavaId }]
        })
    })
});

export const useGetUserNewRequiredProstavas = (groupId?: string, userId?: string) =>
    prostavaApi.useGetProstavasQuery(groupId!, {
        skip: !groupId || !userId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter(
                (prostava) =>
                    prostava.status === ProstavaStatus.New &&
                    !prostava.is_request &&
                    prostava.author.id === userId &&
                    prostava.creator.id !== userId
            )
        })
    });
export const useGetUserNewProstava = (groupId?: string, userId?: string, isRequest?: boolean, skip?: boolean) =>
    prostavaApi.useGetProstavasQuery(groupId!, {
        skip: skip || !groupId || !userId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.find(
                (prostava) =>
                    prostava.status === ProstavaStatus.New &&
                    prostava.is_request === isRequest &&
                    prostava.creator.id === userId
            )
        })
    });
export const useGetUserPendingProstavas = (groupId?: string, userId?: string) =>
    prostavaApi.useGetProstavasQuery(groupId!, {
        skip: !groupId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter(
                (prostava) => prostava.status === ProstavaStatus.Pending && prostava.creator.id === userId
            )
        })
    });

export const useGetRemindersQuery = (groupId: string) =>
    prostavaApi.useGetProstavasQuery(groupId, {
        skip: !groupId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter(
                (prostava) =>
                    !prostava.is_request &&
                    prostava.status === ProstavaStatus.New &&
                    prostava.author.id !== prostava.creator.id
            )
        })
    });

export const useGetHistoryQuery = (groupId: string) =>
    prostavaApi.useGetProstavasQuery(groupId, {
        skip: !groupId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter(
                (prostava) => prostava.status === ProstavaStatus.Approved || prostava.status === ProstavaStatus.Rejected
            )
        })
    });

export const useGetPendingProstavasQuery = (groupId?: string) =>
    prostavaApi.useGetProstavasQuery(groupId!, {
        skip: !groupId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter((prostava) => prostava.status === ProstavaStatus.Pending)
        })
    });
