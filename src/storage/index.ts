import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
import * as burgerApi from '../utils/burger-api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { ...burgerApi }
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
