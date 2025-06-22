import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { ORDER_SLICE_NAME } from './sliceNames';
import { RootState } from '..';

export const createOrder = createAsyncThunk(
  `${ORDER_SLICE_NAME}/create`,
  async (ingredients: string[]) => {
    const res = await orderBurgerApi(ingredients);
    return res;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  `${ORDER_SLICE_NAME}/fetchByNumber`,
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

type TOrderState = {
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не возможно создать заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Невозможно получить заказ';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;

export const selectDataOrdersInfo = (number: string) => (state: RootState) => {
  if (state.userOrders.orders.length) {
    const order = state.userOrders.orders.find(
      (order) => order.number === +number
    );
    if (order) return order;
  }

  if (state.feed.orders.length) {
    const order = state.feed.orders.find((order) => order.number === +number);
    if (order) return order;
  }

  if (state.order.currentOrder?.number === +number) {
    return state.order.currentOrder;
  }

  return null;
};
