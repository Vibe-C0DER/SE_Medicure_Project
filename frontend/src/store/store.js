import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import authReducer from './authSlice';
import searchReducer from './searchSlice';
import symptomReducer from './symptomSlice';

// Storage mapped conditionally relying on logical "Keep Me Logged In" persistence preference
const useLocal = localStorage.getItem('keepLoggedIn') === 'true';

const persistConfig = {
  key: 'auth',
  storage: useLocal ? storageLocal : storageSession,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const persistConfigSymptoms = {
  key: 'symptoms',
  storage: storageLocal,
};
const persistedSymptomReducer = persistReducer(persistConfigSymptoms, symptomReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    search: searchReducer,
    symptoms: persistedSymptomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents error on Persist serialization objects
    }),
});

export const persistor = persistStore(store);
