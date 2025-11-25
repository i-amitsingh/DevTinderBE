import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionsSlice from "./connectionsSlice";
import type { User } from "../types/User";
import type { Request } from "../types/Request";
import requestsSlice from "./requestsSlice";

export interface RootState {
  user: {
    user: User | null;
  };
  feed: User[] | null;
  connections: User[] | null;
  requests: Request[] | null;
}

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsSlice,
    requests: requestsSlice,
  },
});

export type AppDispatch = typeof appStore.dispatch;
