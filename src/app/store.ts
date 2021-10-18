import { configureStore, ThunkAction, Action, Reducer } from "@reduxjs/toolkit";
import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
import { Location } from "history";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { history } from "./history";
import { api } from "./services/prostava";
import { authName, authReducer } from "../features/auth/authSlice";
import { appName, appReducer } from "../features/app/appSlice";

type LocationState = {
    from: Location;
    error: Error;
};

export const store = configureStore({
    reducer: {
        router: connectRouter(history) as any as Reducer<RouterState<LocationState>>,
        [api.reducerPath]: api.reducer,
        auth: persistReducer({ key: authName, storage }, authReducer)!,
        app: persistReducer({ key: appName, storage }, appReducer)!
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(routerMiddleware(history), api.middleware)
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
