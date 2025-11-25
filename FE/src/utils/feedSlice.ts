import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/User";

type FeedState = User[] | null;

const feedSlice = createSlice({
  name: "feed",
  initialState: null as FeedState,
  reducers: {
    addFeed: (_state, action: PayloadAction<User[]>) => {
      return action.payload;
    },

    removeFeed: (state, action: PayloadAction<string>) => {
      if (!state) return state;
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
