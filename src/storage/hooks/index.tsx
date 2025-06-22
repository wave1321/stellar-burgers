import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk as createAsyncThunkRedux } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import * as api from '../../utils/burger-api';

type ApiFunctions = typeof api;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createAppAsyncThunk = createAsyncThunkRedux.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: ApiFunctions;
}>();
