import { createSlice } from '@reduxjs/toolkit';

const fileDataSlice = createSlice({
  name: 'fileData',
  initialState: {
    fileName: null,
    channelData: null,
    energy: null,
    channels: null,
    energyCoefficients: null,
    liveTime: null,
    realTime: null,
    shapeCoefficients: null,
  },
  reducers: {
    setFileData(state, action) {
      return { ...state, ...action.payload };
    },
    clearFileData(state) {
      return { id: null, name: '', email: '' };
    },
  },
});

export const { setFileData, clearFileData } = fileDataSlice.actions;
export default fileDataSlice.reducer;
