import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../app/services";
import { RootState } from "../../app/store";

type AppState = {
    groupId: string | null;
    language: string;
};

const slice = createSlice({
    name: "app",
    initialState: { groupId: null, language: "en" } as AppState,
    reducers: {
        setGroupId: (state, action: PayloadAction<string>) => {
            state.groupId = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.getGroups.matchFulfilled, (state, { payload: groups }) => {
            if (!groups || !groups.length) {
                return;
            }
            if (!state.groupId) {
                state.groupId = groups[0].id;
            }
        });

        builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
            state.groupId = null;
        });
    }
});

export default slice;

export const appName = slice.name;
export const appReducer = slice.reducer;
export const { setGroupId, setLanguage } = slice.actions;

export const selectStorageGroupId = (state: RootState) => state.app.groupId;
export const selectStorageLanguage = (state: RootState) => state.app.language;
