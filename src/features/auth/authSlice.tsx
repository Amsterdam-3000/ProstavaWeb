import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/services";
import { RootState } from "../../app/store";

type AuthState = {
    token: string | null;
};

const slice = createSlice({
    name: "auth",
    initialState: { token: null } as AuthState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.loginApp.matchFulfilled, (state, { payload }) => {
            state.token = payload;
        });
        builder.addMatcher(api.endpoints.loginWebApp.matchFulfilled, (state, { payload }) => {
            state.token = payload;
        });

        builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
            state.token = null;
        });
    }
});

export default slice;

export const authName = slice.name;
export const authReducer = slice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
