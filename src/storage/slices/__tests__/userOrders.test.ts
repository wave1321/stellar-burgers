import userOrdersSlice from '../userOrders';
import { USERORDERS_SLICE_NAME } from '../sliceNames';
import type { TOrder } from '@utils-types';

describe('userOrdersSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['ing1', 'ing2'],
      status: 'done',
      name: 'Order 1',
      number: 1,
      createdAt: '2025-07-04',
      updatedAt: '2025-07-04'
    },
    {
      _id: '2',
      ingredients: ['ing3', 'ing4'],
      status: 'pending',
      name: 'Order 2',
      number: 2,
      createdAt: '2025-07-04',
      updatedAt: '2025-07-04'
    }
  ];

  describe('fetchUserOrders actions', () => {
    it('Состояние ожиания', () => {
      const action = { type: `${USERORDERS_SLICE_NAME}/fetchAll/pending` };
      const state = userOrdersSlice(initialState, action);
      expect(state).toEqual({
        orders: [],
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const action = {
        type: `${USERORDERS_SLICE_NAME}/fetchAll/fulfilled`,
        payload: mockOrders
      };
      const state = userOrdersSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        orders: mockOrders,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Failed to fetch user orders';
      const action = {
        type: `${USERORDERS_SLICE_NAME}/fetchAll/rejected`,
        error: { message: errorMessage }
      };
      const state = userOrdersSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: errorMessage || 'Невозможно получить заказы пользователя'
      });
    });
  });
});
