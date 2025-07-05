import feedSlice, { fetchFeeds } from '../feed';
import type { TOrder } from '../../../utils/types';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
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

  const mockFeedResponse = {
    orders: mockOrders,
    total: 100,
    totalToday: 10,
    success: true
  };

  describe('fetchFeeds actions', () => {
    it('Состояние ожидания', () => {
      const pendingAction = fetchFeeds.pending('');
      const state = feedSlice(initialState, pendingAction);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const fulfilledAction = fetchFeeds.fulfilled(mockFeedResponse, '');
      const state = feedSlice(
        { ...initialState, loading: true },
        fulfilledAction
      );
      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Не возможно получить ленту заказов';
      const rejectedAction = fetchFeeds.rejected(new Error(errorMessage), '');
      const state = feedSlice(
        { ...initialState, loading: true },
        rejectedAction
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
