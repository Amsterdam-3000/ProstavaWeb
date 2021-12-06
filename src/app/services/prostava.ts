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
}

export const prostavaApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        getProstavas: builder.query<Prostava[], string>({
            query: (groupId) => ({ url: `app/group/${groupId}/prostavas` }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((prostava) => ({ type: "Prostavas", id: prostava.id } as const)),
                          { type: "Prostavas", id: "ALL" }
                      ]
                    : [{ type: "Prostavas", id: "ALL" }]
        })
    })
});

export const useGetRemindersQuery = (groupId: string) =>
    prostavaApi.useGetProstavasQuery(groupId, {
        skip: !groupId,
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.filter((prostava) => prostava.status === ProstavaStatus.New)
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
