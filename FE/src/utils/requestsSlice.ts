import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Request } from "../types/Request";

type RequestsState = Request[] | null;

const requestsSlice = createSlice({
  name: "requests",
  initialState: null as RequestsState,
  reducers: {
    addRequests: (_state, action: PayloadAction<Request[]>) => {
      return action.payload;
    },
  },
});

export const { addRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
