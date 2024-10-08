import { createSlice } from '@reduxjs/toolkit';

const activeProfileDataSlice = createSlice({
  name: 'activeProfile',
  initialState: [],
  reducers: {
    setActiveProfile(state, action) {
      return  [...action.payload] ;
    },
    clearActiveProfile(state) {
      return [];
    },
  },
});

export const { setActiveProfile, clearActiveProfile } = activeProfileDataSlice.actions;
export default activeProfileDataSlice.reducer;
