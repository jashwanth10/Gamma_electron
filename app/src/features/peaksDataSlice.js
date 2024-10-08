import { createSlice } from '@reduxjs/toolkit';

const peaksDataSlice = createSlice({
  name: 'peakData',
  initialState: [],
  reducers: {
    setFileData(state, action) {
      return [...state, ...action.payload];
    },
    clearFileData(state) {
      return [];
    },
  },
});

export const { setPeakData, clearPeakData } = peaksDataSlice.actions;
export default peaksDataSlice.reducer;
