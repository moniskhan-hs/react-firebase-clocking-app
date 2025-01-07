import { combineReducers, configureStore } from "@reduxjs/toolkit/react";
import { counterReducer } from "./reducers/counter";
import { userReducer } from "./reducers/user";

import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { totalClockingReducer } from "./reducers/totalClocking";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducers = combineReducers({
    [counterReducer.name]: counterReducer.reducer,
    [userReducer.name]: userReducer.reducer,
    [totalClockingReducer.name]:totalClockingReducer.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
