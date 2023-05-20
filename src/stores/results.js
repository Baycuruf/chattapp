// store/results.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    setResults: (state, action) => {
      return action.payload;
    },
  },
});

export const { setResults } = resultsSlice.actions;
export default resultsSlice.reducer;
