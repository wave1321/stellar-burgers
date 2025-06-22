import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '..';
import { USERORDERS_SLICE_NAME } from './sliceNames';

export const fetchUserOrders = createAsyncThunk(
  `${USERORDERS_SLICE_NAME}/fetchAll`,
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: USERORDERS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Невозможно получить заказ пользователя';
      });
  }
});

export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.loading;

export default userOrdersSlice.reducer;
