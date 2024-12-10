// store.js
import { configureStore } from '@reduxjs/toolkit';
import fileDataReducer from './features/fileDataSlice';
import activeProfileDataReducer from './features/activeProfileDataSlice';
import peaksDataReducer from './features/peaksDataSlice';
import sampleDataReducer from './features/sampleDataSlice';

export const store = configureStore({
  reducer: {
    fileData: fileDataReducer,
    activeProfileData: activeProfileDataReducer,
    peaksData: peaksDataReducer,
    sampleData: sampleDataReducer,
  },
});
