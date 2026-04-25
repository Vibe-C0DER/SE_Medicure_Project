import { createSlice } from '@reduxjs/toolkit';

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
});

export const { toggleSymptom, removeSymptom, clearSymptoms } = symptomSlice.actions;
export default symptomSlice.reducer;
