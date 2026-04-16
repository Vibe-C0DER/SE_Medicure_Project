import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [],
  query: '',
  location: '',
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload.results;
      state.query = action.payload.query;
      state.location = action.payload.location;
      state.loading = false;
      state.error = null;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSearchError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSearch: (state) => {
      state.results = [];
      state.query = '';
      state.location = '';
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSearchResults, setSearchLoading, setSearchError, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
