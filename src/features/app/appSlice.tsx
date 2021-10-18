import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { api } from "../../app/services/prostava";
import { RootState } from "../../app/store";

type AppState = {
    groupId: number | null;
};

const slice = createSlice({
    name: "app",
    initialState: { groupId: null } as AppState,
    reducers: {
        setGroupId: (state, action: PayloadAction<number>) => {
            state.groupId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.getGroups.matchFulfilled, (state, { payload }) => {
            if (!payload || !payload.length) {
                return;
            }
            if (!state.groupId) {
                state.groupId = payload[0].id;
            }
        });
    }
});

export default slice;

export const appName = slice.name;
export const appReducer = slice.reducer;
export const { setGroupId } = slice.actions;

export const selectStorageGroupId = (state: RootState) => state.app.groupId;
