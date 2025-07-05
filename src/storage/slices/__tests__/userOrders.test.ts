import userOrdersSlice, { fetchUserOrders } from '../userOrders';
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
    it('Состояние ожидания', () => {
      const pendingAction = fetchUserOrders.pending('');
      const state = userOrdersSlice(initialState, pendingAction);
      expect(state).toEqual({
        orders: [],
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const fulfilledAction = fetchUserOrders.fulfilled(mockOrders, '');
      const state = userOrdersSlice(
        { ...initialState, loading: true },
        fulfilledAction
      );
      expect(state).toEqual({
        orders: mockOrders,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Невозможно получить заказы пользователя';
      const rejectedAction = fetchUserOrders.rejected(
        new Error(errorMessage),
        ''
      );
      const state = userOrdersSlice(
        { ...initialState, loading: true },
        rejectedAction
      );
      expect(state).toEqual({
        orders: [],
        loading: false,
        error: 'Невозможно получить заказы пользователя'
      });
    });
  });
});
