import { createSlice } from '@reduxjs/toolkit';

const sampleDataSlice = createSlice({
  name: 'sampleData',
  initialState: {
    weight: 0,
    liveTime: 0,
    deadTime: 0,
  },
  reducers: {
    setSampleData(state, action) {
      return {...state, ...action.payload};
    },
    clearSampleData(state) {
      return initialState;
    },
  },
});

export const { setSampleData, clearSampleData } = sampleDataSlice.actions;
export default sampleDataSlice.reducer;
