import feedSlice from '../feed';
import { FEED_SLICE_NAME } from '../sliceNames';
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
    totalToday: 10
  };

  describe('fetchFeeds actions', () => {
    it('Состояние ожидания', () => {
      const action = { type: `${FEED_SLICE_NAME}/fetchAll/pending` };
      const state = feedSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const action = {
        type: `${FEED_SLICE_NAME}/fetchAll/fulfilled`,
        payload: mockFeedResponse
      };
      const state = feedSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Failed to fetch feed';
      const action = {
        type: `${FEED_SLICE_NAME}/fetchAll/rejected`,
        error: { message: errorMessage }
      };
      const state = feedSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage || 'Не возможно получить ленту заказов'
      });
    });
  });
});
