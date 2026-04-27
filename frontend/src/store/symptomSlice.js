import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice.js';

const symptomSlice = createSlice({
  name: 'symptoms',
  initialState: {
    selectedIds: [],
  },
  reducers: {
    toggleSymptom: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds.unshift(id);
      }
    },
    removeSymptom: (state, action) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.filter((x) => x !== id);
    },
    clearSymptoms: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.selectedIds = [];
    });
  }
});

export const { toggleSymptom, removeSymptom, clearSymptoms } = symptomSlice.actions;
export default symptomSlice.reducer;
