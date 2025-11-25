import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/User";

type FeedState = User[] | null;

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null as FeedState,
  reducers: {
    addConnections: (_state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    removeConnections: () => {
      return null;
    },
  },
});

export const { addConnections, removeConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
