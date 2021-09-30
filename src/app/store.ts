import { configureStore, ThunkAction, Action, Reducer } from "@reduxjs/toolkit";
import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
import { Location } from "history";

import { history } from "./history";
import { api } from "./services/prostava";
import authReducer from "../features/auth/authSlice";

type LocationState = {
    from: Location;
};

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        router: connectRouter(history) as any as Reducer<RouterState<LocationState>>
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history), api.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
