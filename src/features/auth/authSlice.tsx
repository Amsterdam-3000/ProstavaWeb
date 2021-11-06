import { createSlice } from "@reduxjs/toolkit";

import { api } from "../../app/services/prostava";
import { RootState } from "../../app/store";

type AuthState = {
    token: string | null;
};

const slice = createSlice({
    name: "auth",
    initialState: { token: null } as AuthState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
            state.token = payload;
        });
    }
});

export default slice;

export const authName = slice.name;
export const authReducer = slice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
