// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "@/sagas";

const sagaMiddleWare = createSagaMiddleware();

// Create the store using configureStore
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false, // optional: disable if you're hitting serialization warnings
    }).concat(sagaMiddleWare),
  devTools: import.meta.env.DEV, // enable Redux DevTools in development
});

sagaMiddleWare.run(rootSaga);

// Optional: for migration
export const reduxStore = store;

// Types
export type Store = typeof store;
export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Action = Parameters<AppDispatch>[0];
