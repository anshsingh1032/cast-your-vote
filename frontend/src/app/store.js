import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import candidateReducer from '../features/candidates/candidateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidateReducer,
  },
});