import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './feedSlice';

export const store = configureStore({
  reducer: {
    posts: feedReducer, // key for useSelector
  },
});
