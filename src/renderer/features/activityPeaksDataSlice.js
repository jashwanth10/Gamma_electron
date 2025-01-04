import { createSlice } from '@reduxjs/toolkit';

const activityPeaksDataSlice = createSlice({
  name: 'activePeakData',
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

export const { setActivityPeaksData, clearActivityPeaksData } = activityPeaksDataSlice.actions;
export default activityPeaksDataSlice.reducer;
